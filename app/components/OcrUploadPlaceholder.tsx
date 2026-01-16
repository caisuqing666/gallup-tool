'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface OcrUploadPlaceholderProps {
  onNext: (imageData: string) => void;
  onBack: () => void;
}

export default function OcrUploadPlaceholder({
  onNext,
  onBack,
}: OcrUploadPlaceholderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // 创建预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleContinue = () => {
    if (uploadedImage) {
      onNext(uploadedImage);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary px-4 sm:px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 返回按钮 */}
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 text-text-secondary hover:text-text-primary flex items-center gap-2 transition-colors"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>返回</span>
        </motion.button>

        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2 font-serif">
            上传你的盖洛普报告
          </h1>
          <p className="text-text-secondary text-sm">
            支持 JPG、PNG 格式，系统将自动识别你的 TOP5 优势
          </p>
        </motion.div>

        {/* 上传区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {!uploadedImage ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                ${isDragging
                  ? 'border-brand bg-brand/5'
                  : 'border-border-light hover:border-brand/50 hover:bg-bg-secondary'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />

              {/* 图标 */}
              <div className="w-16 h-16 mx-auto mb-4 text-text-tertiary">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* 提示文字 */}
              <p className="text-text-primary font-medium mb-2">
                点击或拖拽上传报告图片
              </p>
              <p className="text-text-tertiary text-sm">
                请确保图片清晰，包含 TOP5 优势列表
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* 预览图片 */}
              <div className="bg-bg-card rounded-2xl p-4 mb-4">
                <img
                  src={uploadedImage}
                  alt="上传的报告"
                  className="w-full h-auto rounded-lg"
                />
              </div>

              {/* 重新上传按钮 */}
              <button
                onClick={() => {
                  setUploadedImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="w-full py-3 border-2 border-border-light rounded-xl text-text-primary font-medium hover:bg-bg-card transition-colors"
              >
                重新上传
              </button>
            </div>
          )}
        </motion.div>

        {/* 即将推出提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-status-warning/5 border border-status-warning/20 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-status-warning flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary mb-1">
                功能即将推出
              </p>
              <p className="text-xs text-text-tertiary">
                目前为占位演示版本。完整实现后将支持 OCR 识别盖洛普官方报告，
                自动提取 TOP5 优势并生成个性化解读。
              </p>
            </div>
          </div>
        </motion.div>

        {/* 继续按钮 */}
        {uploadedImage && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleContinue}
            className="w-full py-4 bg-brand text-white rounded-xl font-medium hover:bg-brand/90 transition-colors"
          >
            继续查看示例解读
          </motion.button>
        )}
      </div>
    </div>
  );
}
