export const supportedNodes = [
  'root',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'paragraph',
  'code',
  null,
] as const;
export type SupportedNodeType = (typeof supportedNodes)[number];
export const isSupportedNode = (arg: unknown): arg is SupportedNodeType => {
  return supportedNodes.some((supportedNode) => supportedNode === arg);
};
