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
