export interface IVMInput {
	px: Float64Array;
	py: Float64Array;
	pdx: Float64Array;
	pdy: Float64Array;
	fields: { [key: string]: Float64Array };
}
