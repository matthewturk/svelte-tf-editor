export interface GirderCollection {
	_accessLevel: number;
	_id: string;
	_modelType: string;
	created: Date;
	description: string;
	name: string;
	public: boolean;
	publicFlags: string[];
	size: number;
	updated: Date;
}

export interface GirderCollectionDetails {
	nFolders: number;
}
interface GirderJson {
	[x: string]: string | number | boolean | Date | GirderJson | GirderJson[];
}
export interface GirderFolderDetails {
	_accessLevel: number;
	_id: string;
	_modelType: string; // should be enum
	baseParentId: string;
	baseParentType: string; // should be enum
	created: Date;
	creatorId: string;
	description: string;
	meta?: GirderJson;
	name: string;
	parentCollection: string; // should be enum maybe?
	parentId: string;
	public: boolean;
	size: number;
	updated: Date;
}
