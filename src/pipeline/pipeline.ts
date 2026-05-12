type Progres = (progress: number) => void;

async function delay(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
}

async function step1(): Promise<void> {
    await delay(3000);
}

async function step2(): Promise<void> {
    await delay(4000);
}

async function step3(): Promise<void> {
    await delay(5000);
}

export async function runPipeline(onProgress: Progres) {
    await step1();
    onProgress(33);

    await step2();
    onProgress(66);

    await step3();
    onProgress(100);

}

// async function WebSocketProgress(): Promise<void> {
//     await new Promise(resolve => setTimeout(resolve, 4000))
// }
//
// export async function runPipeline(onProgress: Progres) {
//     let progress = 34;

//     while(progress <= 100) {
//         await WebSocketProgress();
//         onProgress(progress);
//         progress += 33;
//     }
// }