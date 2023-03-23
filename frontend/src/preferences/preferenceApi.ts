// not all properties in Doc are going to be present. Make some optional
export type Doc = {
  name: string;
  version?: string;
  description?: string;
  key: Key;
};

export enum Key {
  // 用户手册
  Manual,
  // 索引类型
  faiss,
  chromadb,
  simplevector,
  leafTree,
}

export type Index = Doc;

export const defaultIndexes: Index[] = [
  {
    name: 'Faiss',
    key: Key.faiss,
  },
  {
    name: 'ChromaDB',
    key: Key.chromadb,
  },
  {
    name: 'GPTSimplevectorIndex',
    key: Key.simplevector,
  },
  {
    name: 'GPTTreeIndexLeaf',
    key: Key.leafTree,
  },
  // {
  //   name: 'GPTTreeIndex',
  //   key: 'manual',

  // },
  // {
  //   name: 'GPTTreeIndexRetQuery',
  //   key: 'manual',

  // },
];

//Fetches all JSON objects from the source. We only use the objects with the "model" property in SelectDocsModal.tsx. Hopefully can clean up the source file later.
export async function getDocs(): Promise<Doc[] | null> {
  try {
    // const response = await fetch(
    //   'https://d3dg1063dc54p9.cloudfront.net/combined.json',
    // );

    // const data = await response.json();

    const docs: Doc[] = [
      {
        name: 'ONES Manual',
        key: Key.Manual,
      },
    ];

    // data.forEach((doc: object) => {
    //   docs.push(doc as Doc);
    // });

    return docs;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getIndexes(): Promise<Doc[] | null> {
  try {
    // const response = await fetch(
    //   'https://d3dg1063dc54p9.cloudfront.net/combined.json',
    // );
    // const data = await response.json();

    return de;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function getLocalApiKey(): string | null {
  const key = localStorage.getItem('DocsGPTApiKey');
  return key;
}

export function getLocalRecentDocs(): string | null {
  const doc = localStorage.getItem('DocsGPTRecentDocs');
  return doc;
}

export function setLocalApiKey(key: string): void {
  localStorage.setItem('DocsGPTApiKey', key);
}

export function setLocalRecentDocs(doc: Doc): void {
  localStorage.setItem('DocsGPTRecentDocs', JSON.stringify(doc));
  let namePath = doc.name;
  if (doc.language === namePath) {
    namePath = '.project';
  }

  const docPath =
    doc.name === 'default'
      ? 'default'
      : doc.language +
        '/' +
        namePath +
        '/' +
        doc.version +
        '/' +
        doc.model +
        '/';
  const apiHost = import.meta.env.VITE_API_HOST || 'https://docsapi.arc53.com';
  fetch(apiHost + '/api/docs_check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      docs: docPath,
    }),
  }).then((response) => response.json());
}

export function setLocalRecentIndex(index: Index): void {
  localStorage.setItem('DocsGPTRecentIndex', JSON.stringify(index));
  let namePath = index.name;
  if (index.language === namePath) {
    namePath = '.project';
  }

  const indexPath =
    index.name === 'default'
      ? 'default'
      : index.language +
        '/' +
        namePath +
        '/' +
        index.version +
        '/' +
        index.model +
        '/';
  const apiHost =
    import.meta.env.VITE_API_HOST || 'https://indexsapi.arc53.com';
  fetch(apiHost + '/api/docs_check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      docs: indexPath,
    }),
  }).then((response) => response.json());
}
