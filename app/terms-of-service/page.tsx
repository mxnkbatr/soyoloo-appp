'use client';
import { motion } from 'framer-motion';
import {
  FileText,
  Scale,
  CreditCard,
  Truck,
  RotateCcw,
  AlertCircle,
  Gavel,
  ShieldCheck
} from 'lucide-react';

export default function TermsOfServicePage() {
  const terms = [
    {
      icon: Scale,
      title: 'Ерөнхий нөхцөл',
      content: 'Soyol Video Shop-ийг ашигласнаар та манай үйлчилгээний нөхцөлийг хүлээн зөвшөөрч буй хэрэг юм. Бид үйлчилгээний нөхцөлдөө хэдийд ч өөрчлөлт оруулах эрхтэй.'
    },
    {
      icon: CreditCard,
      title: 'Төлбөр тооцоо',
      content: 'Барааны үнэ болон тээвэрлэлтийн зардлыг Qpay, дансаар шилжүүлэх зэрэг боломжтой хэлбэрүүдээр урьдчилан төлнө.'
    },
    {
      icon: Truck,
      title: 'Хүргэлт',
      content: 'Хүргэлтийг заасан хугацаанд гүйцэтгэнэ. Хөдөө орон нутгийн хүргэлт тээврийн компанийн хуваарийн дагуу явагдана.'
    },
    {
      icon: RotateCcw,
      title: 'Буцаалт ба солих',
      content: 'Бараа хүлээн авснаас хойш 72 цагийн дотор буцаах эсвэл солих хүсэлт гаргаж болно. Барааны бүрэн бүтэн байдал хадгалагдсан байх шаардлагатай.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <FileText className="w-8 h-8 text-blue-600" />
          </motion.div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">Үйлчилгээний нөхцөл</h1>
          <p className="text-gray-500 font-medium italic">Сүүлд шинэчлэгдсэн: 2026 оны 4-р сарын 8</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-white">
          <div className="space-y-12">
            {terms.map((term, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-gray-50 border border-transparent hover:border-gray-200 hover:bg-white transition-all group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-blue-600">
                    <term.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">{term.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed font-medium text-lg">{term.content}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-blue-50 border border-blue-100 flex gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-black text-gray-900 mb-2">Анхааруулга</h4>
              <p className="text-gray-600 font-medium">
                Хэрэглэгч системд нэвтрэх нууц үг, мэдээллээ бусдад дамжуулахгүй байх үүрэгтэй. Бусдад дамжуулсанаас үүдэх аливаа эрсдлийг компани хариуцахгүй.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
