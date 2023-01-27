declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.pdf' {
  const value: string;
  export default value;
}
