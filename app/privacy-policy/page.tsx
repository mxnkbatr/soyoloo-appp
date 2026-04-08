'use client';
import { motion } from 'framer-motion';
import {
  Shield,
  Eye,
  Lock,
  FileText,
  UserCheck,
  Bell,
  Cookie,
  Mail
} from 'lucide-react';
import { SITE_CONFIG } from '@lib/constants';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Eye,
      title: 'Мэдээлэл цуглуулах',
      content: 'Бид таныг бүртгүүлэх, захиалга өгөх эсвэл манай үйлчилгээг ашиглах үед таны нэр, утасны дугаар, хаяг, и-мэйл зэрэг мэдээллийг цуглуулдаг.'
    },
    {
      icon: Lock,
      title: 'Мэдээллийн аюулгүй байдал',
      content: 'Таны хувийн мэдээллийг бид хамгийн сүүлийн үеийн нууцлалын технологиор хамгаалдаг бөгөөд зөвшөөрөлгүй хандалтаас сэргийлдэг.'
    },
    {
      icon: UserCheck,
      title: 'Мэдээлэл ашиглах',
      content: 'Цуглуулсан мэдээллийг захиалга биелүүлэх, үйлчилгээг сайжруулах, танд хэрэгтэй мэдээлэл хүргэх зорилгоор ашиглана.'
    },
    {
      icon: Cookie,
      title: 'Күүки (Cookies)',
      content: 'Манай вэбсайт нь хэрэглэгчийн туршлагыг сайжруулах зорилгоор күүки ашигладаг. Та хөтөчийн тохиргооноос үүнийг удирдах боломжтой.'
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
            className="w-16 h-16 bg-soyol/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Shield className="w-8 h-8 text-soyol" />
          </motion.div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">Нууцлалын бодлого</h1>
          <p className="text-gray-500 font-medium italic">Сүүлд шинэчлэгдсэн: 2026 оны 4-р сарын 8</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-white">
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            Soyol Video Shop нь таны хувийн нууцыг хүндэтгэх бөгөөд бидэнд итгэж өгсөн мэдээллийг хамгаалах нь бидний нэн тэргүүний үүрэг юм. Энэхүү баримт бичигт бид таны мэдээллийг хэрхэн цуглуулдаг, ашигладаг, хамгаалдаг талаар тайлбарлана.
          </p>

          <div className="grid gap-12">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-soyol group-hover:text-white transition-all">
                  <section.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">{section.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium">{section.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-soyol/5 border border-soyol/10">
            <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-soyol" />
              Бидэнтэй холбогдох
            </h4>
            <p className="text-gray-600 font-medium">
              Нууцлалын бодлоготой холбоотой асуулт байвал {SITE_CONFIG.email} хаягаар эсвэл {SITE_CONFIG.phone} дугаарт холбогдоно уу.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
