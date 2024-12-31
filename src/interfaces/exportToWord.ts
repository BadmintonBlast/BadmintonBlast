import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType } from "docx";

// Function to export bill data to a Word document
export function exportToWord(billData) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "CHI TIẾT HÓA ĐƠN",
                bold: true,
                size: 40,
                color: "444444",
              }),
            ],
            alignment: AlignmentType.CENTER, 
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Mã đơn: ${billData.idbill}`,
                bold: true,
                size: 32,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Thông tin người gửi",
                bold: true,
                size: 32,
              }),
            ],
            spacing: { after: 100 },
          }),
          // Table with two columns for sender and receiver
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Từ: BADMINTON-BLAST",
                            size: 24,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Địa chỉ: 578 Nguyễn Duy",
                            size: 24,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "SĐT: 0384753419",
                            size: 24,
                          }),
                        ],
                      }),
                    ],
                    width: { size: 50, type: "pct" }, // Left column (sender)
                    shading: { fill: "CCCCCC" },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Đến: ${billData.namecustomer}`,
                            size: 24,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Địa chỉ: ${billData.address}`,
                            size: 24,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `SĐT: ${billData.phone}`,
                            size: 24,
                          }),
                        ],
                      }),
                    ],
                    width: { size: 50, type: "pct" }, // Right column (receiver)
                    shading: { fill: "CCCCCC" },
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Nội dung đơn hàng",
                bold: true,
                size: 32,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Tên sản phẩm")],
                    width: { size: 70, type: "pct" },
                    shading: { fill: "CCCCCC" },
                  }),
                  new TableCell({
                    children: [new Paragraph("Số lượng")],
                    width: { size: 30, type: "pct" },
                    shading: { fill: "CCCCCC" },
                  }),
                ],
              }),
              ...billData.orders.map(
                (order) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph(order.productDetails.nameproduct),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(`${order.quatity}`),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Tổng tiền đặt hàng: ${billData.totalamount.toLocaleString()}đ`,
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Ngày đặt hàng: ${new Date(
                  billData.dateorder
                ).toLocaleDateString("vi-VN")}`,
                size: 24,
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Download the Word document
  Packer.toBlob(doc).then((blob) => {
    const fileName = `ChiTietDonHang_${billData.idbill}.docx`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  });
}
