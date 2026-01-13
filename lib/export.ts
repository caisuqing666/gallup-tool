// 导出功能
// 支持图片导出

export interface ExportOptions {
  filename?: string;
  format?: 'png' | 'jpeg';
  scale?: number;
}

/**
 * 导出为图片
 * @param element - 要导出的 DOM 元素
 * @param options - 导出配置选项
 */
export async function exportToImage(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = `gallup_result_${Date.now()}`,
    format = 'png',
    scale = 2,
  } = options;

  try {
    const html2canvasModule = await import('html2canvas');
    const html2canvas = html2canvasModule.default;
    
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#FAFAF8',
    });

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error('无法生成图片');
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      `image/${format}`,
      1
    );
  } catch (error) {
    console.error('图片导出失败:', error);
    throw new Error('图片导出失败');
  }
}

/**
 * 导出为 PDF（占位函数）
 * 注意：此功能需要安装 jsPDF
 * 安装命令：npm install jspdf
 * 
 * 如需启用，请安装 jsPDF 后取消注释以下代码：
 * 
 * export async function exportToPDF(element: HTMLElement, options: any = {}) {
 *   const jsPDF = (await import('jspdf')).default;
 *   const html2canvas = (await import('html2canvas')).default;
 *   // ... PDF 导出逻辑
 * }
 */
export async function exportToPDF(
  element: HTMLElement,
  options: { filename?: string; scale?: number } = {}
): Promise<void> {
  // PDF 导出功能暂未启用
  // 降级到图片导出
  console.warn('PDF 导出功能暂未启用，已降级到图片导出');
  const { filename = `gallup_result_${Date.now()}`, scale = 2 } = options;
  return exportToImage(element, { filename: filename.replace('.pdf', ''), scale });
}
