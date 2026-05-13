type Progres = (progress: number) => void;
export declare function runPipeline(onProgress: Progres): Promise<void>;
export {};
