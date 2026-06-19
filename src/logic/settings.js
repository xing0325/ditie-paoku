// 极简设置:血腥度模式(风格化 / 写实),注入 storage 以便测试与持久化。
const VALID = ['stylized', 'realistic'];

export function createSettings(storage) {
  let mode = storage?.getItem?.('gore');
  if (!VALID.includes(mode)) mode = 'stylized';
  return {
    get gore() { return mode; },
    cycle() {
      mode = mode === 'stylized' ? 'realistic' : 'stylized';
      storage?.setItem?.('gore', mode);
      return mode;
    },
  };
}
