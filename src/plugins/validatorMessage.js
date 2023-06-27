// 必須
export const requiredMessage = (value) => `${value}は必須項目です`;
// メールアドレス
export const emailMessage = () => `メールアドレスの形式が正しくありません`;
// 最低文字数
export const minLengthMessage = (value, length) =>
  `${value}は${length}文字以上必要です`;
// 最大文字数
export const maxLengthMessage = (value, length) =>
  `${value}は${length}文字以内で入力が必要です`;
