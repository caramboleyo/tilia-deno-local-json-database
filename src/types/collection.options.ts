export default interface CollectionOptions {
	filename: string;
	onLoad?: () => void;
	/** @deprecated */
	timeStamp?: string;
	autoload?: boolean;
	bufSize?: number;
}
