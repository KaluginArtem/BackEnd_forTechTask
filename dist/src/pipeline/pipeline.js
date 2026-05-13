"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPipeline = runPipeline;
async function delay(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}
async function step1() {
    await delay(3000);
}
async function step2() {
    await delay(4000);
}
async function step3() {
    await delay(5000);
}
async function runPipeline(onProgress) {
    await step1();
    onProgress(33);
    await step2();
    onProgress(66);
    await step3();
    onProgress(100);
}
//# sourceMappingURL=pipeline.js.map