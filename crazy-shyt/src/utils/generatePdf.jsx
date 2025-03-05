import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

async function fetchPollutionsImage(prompt) {
    try {
      const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
      if (!response.ok) {
        throw new Error('Image generation failed');
      }
      return response.url;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  }

export default generatePDFReport = async (messages, conversationContext) => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
      // Generate a comprehensive report text using Gemini
      const reportPrompt = `Create a professional, concise report summarizing this conversation context. 
      Include:
      - Overall conversation summary
      - Key topics discussed
      - Significant keywords
      - Insights and potential next steps
      
      Conversation Context:
      Topics: ${conversationContext.topics.join(', ')}
      Keywords: ${conversationContext.keywords.join(', ')}
      Summary: ${conversationContext.summary}`;
  
      const reportText = await getGeminiResponse(reportPrompt);
  
      // Generate images for the report
      const mainImageUrl = await fetchPollutionsImage(
        conversationContext.topics[0] || 'professional business meeting'
      );
      const summaryImageUrl = await fetchPollutionsImage(
        conversationContext.keywords.slice(0, 2).join(' and ') || 'business communication'
      );
  
      // Add title
      const titleFontSize = 24;
      page.drawText('Conversation Report', {
        x: 50,
        y: height - 50,
        size: titleFontSize,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.5)
      });
  
      // Add context details
      let yPosition = height - 100;
      const fontSize = 12;
      const lineHeight = 15;
  
      // Draw context details
      page.drawText(`Conversation Topics: ${conversationContext.topics.join(', ')}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0)
      });
      yPosition -= lineHeight;
  
      page.drawText(`Keywords: ${conversationContext.keywords.join(', ')}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0)
      });
      yPosition -= lineHeight * 2;
  
      // Add report text with word wrapping
      const textLines = [];
      const words = reportText.split(' ');
      let currentLine = '';
      words.forEach(word => {
        if (font.widthOfTextAtSize(`${currentLine} ${word}`, fontSize) < width - 100) {
          currentLine += `${word} `;
        } else {
          textLines.push(currentLine);
          currentLine = `${word} `;
        }
      });
      textLines.push(currentLine);
  
      textLines.forEach(line => {
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0)
        });
        yPosition -= lineHeight;
      });
  
      // Add images if available
      if (mainImageUrl) {
        const mainImageBytes = await fetch(mainImageUrl).then(res => res.arrayBuffer());
        const mainImage = await pdfDoc.embedPng(mainImageBytes);
        page.drawImage(mainImage, {
          x: 50,
          y: 50,
          width: 200,
          height: 150
        });
      }
  
      if (summaryImageUrl) {
        const summaryImageBytes = await fetch(summaryImageUrl).then(res => res.arrayBuffer());
        const summaryImage = await pdfDoc.embedPng(summaryImageBytes);
        page.drawImage(summaryImage, {
          x: width - 250,
          y: 50,
          width: 200,
          height: 150
        });
      }
  
      // Serialize PDF to bytes
      const pdfBytes = await pdfDoc.save();
  
      // Create and trigger download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.href = url;
      link.download = `conversation_report_${new Date().toISOString().replace(/:/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      toast.success('PDF Report Generated', {
        description: 'Your conversation report has been downloaded.'
      });
  
    } catch (error) {
      console.error("PDF Report Generation Error:", error);
      toast.error('Report Generation Failed', {
        description: 'Unable to generate PDF report.'
      });
    }
  };