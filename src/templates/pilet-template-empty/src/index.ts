import { resolve, relative } from 'path';
import { getFileFromTemplate, TemplateFile } from './utils';

export interface TemplateArgs {
  language?: string;
  sourceName: string;
  src?: string;
}

export default async function (root: string, args: TemplateArgs) {
  const { language = 'ts', src = 'src', sourceName } = args;
  const srcDir = relative(root, resolve(root, src));
  const files: Array<Promise<TemplateFile>> = [];
  const data = {
    sourceName,
    src: srcDir,
  };

  switch (language) {
    case 'js':
      files.push(getFileFromTemplate(srcDir, 'index.jsx', data));
      break;
    case 'ts':
    default:
      files.push(getFileFromTemplate('.', 'tsconfig.json', data), getFileFromTemplate(srcDir, 'index.tsx', data));
      break;
  }

  return await Promise.all(files);
}
