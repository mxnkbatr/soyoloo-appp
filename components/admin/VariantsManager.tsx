import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Tag, Layers } from 'lucide-react';

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  options: Record<string, string>;
  inventory: number;
  price?: number;
}

interface VariantsManagerProps {
  options: ProductOption[];
  variants: ProductVariant[];
  onChange: (options: ProductOption[], variants: ProductVariant[]) => void;
}

const SUGGESTED_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', 'Standard', 'Large', 'One Size', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];
const SUGGESTED_COLORS = ['Хар', 'Цагаан', 'Саарал', 'Улаан', 'Цэнхэр', 'Ногоон', 'Шар', 'Бор', 'Ягаан', 'Нил Ягаан', 'Алтлаг', 'Мөнгөлөг'];

export default function VariantsManager({ options, variants, onChange }: VariantsManagerProps) {
  const [localOptions, setLocalOptions] = useState<ProductOption[]>(options);
  const [localVariants, setLocalVariants] = useState<ProductVariant[]>(variants);

  // Generate all possible combinations
  const combineOptions = useCallback((opts: ProductOption[]) => {
    if (opts.length === 0 || opts.every(o => o.values.length === 0)) return [];
    
    // Filter out options with no values
    const validOpts = opts.filter(o => o.values.length > 0 && o.name.trim() !== '');
    if (validOpts.length === 0) return [];

    let combinations: Record<string, string>[] = [{}];
    
    validOpts.forEach(option => {
      const newCombinations: Record<string, string>[] = [];
      option.values.forEach(value => {
        combinations.forEach(combo => {
          newCombinations.push({ ...combo, [option.name]: value });
        });
      });
      combinations = newCombinations;
    });

    return combinations;
  }, []);

  // Helper to notify parent of changes — called directly in handlers, NOT in useEffect
  const notifyParent = useCallback((newOptions: ProductOption[], newVariants: ProductVariant[]) => {
    onChange?.(newOptions, newVariants);
  }, [onChange]);

  const handleAddOption = () => {
    const newOptions = [...localOptions, { id: Date.now().toString(), name: '', values: [] }];
    setLocalOptions(newOptions);
    notifyParent(newOptions, localVariants);
  };

  const handleUpdateOptionName = (id: string, name: string) => {
    const oldOptions = [...localOptions];
    const newOptions = localOptions.map(o => o.id === id ? { ...o, name } : o);
    setLocalOptions(newOptions);
    
    // When an option name changes, we need to update the keys in all variants' options objects
    const oldOption = oldOptions.find(o => o.id === id);
    if (oldOption && oldOption.name && name && oldOption.name !== name) {
      const newVariants = localVariants.map(v => {
        const newVariantOptions = { ...v.options };
        if (oldOption.name in newVariantOptions) {
          newVariantOptions[name] = newVariantOptions[oldOption.name];
          delete newVariantOptions[oldOption.name];
        }
        return { ...v, options: newVariantOptions };
      });
      setLocalVariants(newVariants);
      notifyParent(newOptions, newVariants);
    } else {
      notifyParent(newOptions, localVariants);
    }
  };

  const handleRemoveOption = (id: string) => {
    const optionToRemove = localOptions.find(o => o.id === id);
    const newOptions = localOptions.filter(o => o.id !== id);
    setLocalOptions(newOptions);
    
    // Remove the option from all variants
    if (optionToRemove) {
      const updatedVariants = localVariants.map(v => {
        const newVariantOptions = { ...v.options };
        delete newVariantOptions[optionToRemove.name];
        return { ...v, options: newVariantOptions };
      });
      rebuildVariants(newOptions, updatedVariants);
    } else {
      rebuildVariants(newOptions, localVariants);
    }
  };

  const handleAddValue = (optionId: string, value: string) => {
    if (!value.trim()) return;
    const newOptions = localOptions.map(o => {
      if (o.id === optionId && !o.values.includes(value.trim())) {
        return { ...o, values: [...o.values, value.trim()] };
      }
      return o;
    });
    setLocalOptions(newOptions);
    rebuildVariants(newOptions, localVariants);
  };

  const handleRemoveValue = (optionId: string, value: string) => {
    const newOptions = localOptions.map(o => {
      if (o.id === optionId) {
        return { ...o, values: o.values.filter(v => v !== value) };
      }
      return o;
    });
    setLocalOptions(newOptions);
    rebuildVariants(newOptions, localVariants);
  };

  const rebuildVariants = (newOptions: ProductOption[], currentVariants: ProductVariant[]) => {
    const combos = combineOptions(newOptions);
    if (combos.length === 0) {
      setLocalVariants([]);
      notifyParent(newOptions, []);
      return;
    }

    const newVariants: ProductVariant[] = combos.map(combo => {
      // Find existing variant to preserve price and inventory
      const existing = currentVariants.find(v => {
        const vKeys = Object.keys(v.options);
        const comboKeys = Object.keys(combo);
        if (vKeys.length !== comboKeys.length) return false;
        return comboKeys.every(k => v.options[k] === combo[k]);
      });

      return existing || {
        id: 'var_' + Date.now().toString() + Math.random().toString(36).substring(2, 7),
        options: combo,
        inventory: 0,
      };
    });
    setLocalVariants(newVariants);
    notifyParent(newOptions, newVariants);
  };

  const handleVariantChange = (id: string, field: 'inventory' | 'price', value: string) => {
    const newVariants = localVariants.map(v => {
      if (v.id === id) {
        const numVal = parseInt(value) || 0;
        return { ...v, [field]: value === '' ? undefined : numVal };
      }
      return v;
    });
    setLocalVariants(newVariants);
    notifyParent(localOptions, newVariants);
  };

  return (
    <div className="space-y-8">
      {/* Options Builder */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-500" />
          Сонголт (Өнгө, Хэмжээ)
        </h3>
        
        {localOptions.map((option) => (
          <div key={option.id} className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-4">
            <div className="flex gap-4 items-center">
              <input
                type="text"
                value={option.name}
                onChange={(e) => handleUpdateOptionName(option.id, e.target.value)}
                placeholder="Сонголтын нэр (жнэ: Өнгө)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500/50 outline-none text-sm font-bold"
              />
              <button 
                type="button" 
                onClick={() => handleRemoveOption(option.id)}
                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Add Suggestions */}
            {option.name && (option.name.toLowerCase().includes('хэмжээ') || option.name.toLowerCase().includes('size')) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-xs text-slate-500 mt-1 mr-1">Чиглүүлэх:</span>
                {SUGGESTED_SIZES.map(preset => (
                  !option.values.includes(preset) && (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddValue(option.id, preset)}
                      className="px-2 py-1 text-xs bg-slate-800 text-slate-400 rounded hover:bg-amber-500/20 hover:text-amber-500 transition-colors border border-slate-700 hover:border-amber-500/30"
                    >
                      + {preset}
                    </button>
                  )
                ))}
              </div>
            )}

            {option.name && (option.name.toLowerCase().includes('өнгө') || option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('төрөл')) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-xs text-slate-500 mt-1 mr-1">Чиглүүлэх:</span>
                {SUGGESTED_COLORS.map(preset => (
                  !option.values.includes(preset) && (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddValue(option.id, preset)}
                      className="px-2 py-1 text-xs bg-slate-800 text-slate-400 rounded hover:bg-amber-500/20 hover:text-amber-500 transition-colors border border-slate-700 hover:border-amber-500/30"
                    >
                      + {preset}
                    </button>
                  )
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              {option.values.map(val => (
                <span key={val} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium flex items-center gap-2 border border-slate-700">
                  {val}
                  <button type="button" onClick={() => handleRemoveValue(option.id, val)} className="text-slate-500 hover:text-white">
                    &times;
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Утга бичээд + дарна уу"
                  className="bg-transparent border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:border-amber-500 outline-none w-48"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddValue(option.id, e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    handleAddValue(option.id, input.value);
                    input.value = '';
                  }}
                  className="p-1.5 bg-slate-800 text-slate-300 rounded-lg hover:text-amber-500 hover:bg-amber-500/10 border border-slate-700 hover:border-amber-500/30 transition-colors"
                  title="Нэмэх"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddOption}
          className="w-full py-3 border border-slate-800 border-dashed rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all font-bold text-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Шинэ сонголт нэмэх
        </button>
      </div>

      {/* Variants Table */}
      {localVariants.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-500" />
            Хувилбарууд ({localVariants.length})
          </h3>
          
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-bold">
                <tr>
                  <th className="px-4 py-3">Хувилбар</th>
                  <th className="px-4 py-3 w-32">Үлдэгдэл</th>
                  <th className="px-4 py-3 w-40">Тусгай Үнэ (₮)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {localVariants.map((variant) => (
                  <tr key={variant.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-white">
                      {Object.values(variant.options).join(' / ')}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        value={variant.inventory}
                        onChange={(e) => handleVariantChange(variant.id, 'inventory', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 outline-none"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        placeholder="Үндсэн үнэ"
                        value={variant.price || ''}
                        onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">Тусгай үнэ хоосон байвал барааны үндсэн үнийг ашиглана.</p>
        </div>
      )}
    </div>
  );
}
