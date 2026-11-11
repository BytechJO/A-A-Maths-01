type PaintPage = {paintCount:number;colorAnswers:number[];palette:string[]};
export function isCountingGrid(page:PaintPage):boolean;
export function initialPaintColor(page:PaintPage):number;
export function paintRegion(page:PaintPage,previous:Record<string,number>,name:string,color:number):Record<string,number>;
export function gradePaintRegions(regions:{id:string;answer:number}[],paint:Record<string,number>):{total:number;right:number;correct:Record<string,number>};
