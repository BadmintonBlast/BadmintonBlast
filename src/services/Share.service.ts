import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {

  constructor() {}

  // Hàm removeDiacritics để loại bỏ dấu tiếng Việt và thay thế khoảng trắng bằng dấu gạch ngang
  removeDiacritics(str: string): string {
    if (!str) return ''; // Trả về chuỗi rỗng nếu str là undefined hoặc null
  
    const diacriticsMap: { [key: string]: string } = {
      'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
      'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
      'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
      'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
      'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
      'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
      'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
      'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
      'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
      'ô': 'o', 'ơ': 'o',
      'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
      'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
      'ư': 'u',
      'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
      'đ': 'd',
    };
  
    return str
      .toLowerCase() // Chuyển thành chữ thường
      .replace(/[áàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọớờởỡợốồổỗộôơúùủũụứừửữựưýỳỷỹỵđ]/g, function (match) {
        return diacriticsMap[match] || match;
      })
      .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
      .replace(/[^a-z0-9\-]/g, ''); // Loại bỏ ký tự đặc biệt, chỉ giữ lại ký tự thường và số
  }
}
