declare module "@11ty/eleventy" {
  type CollectionItem = {
    [key: string]: any;
  };

  type FilterFn = (name: string, fn: (...args: any[]) => any) => void;
  type PairedFn = (
    name: string,
    fn: (content: string, ...args: any[]) => any
  ) => void;
  type Plugin = (
    fn: (config: EleventyConfig) => void,
    options?: Object
  ) => void;

  type CollectionApi = {
    getAll: () => CollectionItem[];
    getAllSorted: () => CollectionItem[];
    getFilteredByTag: (tagName: string) => CollectionItem[];
    getFilteredByTags: (...tagsNames: string[]) => CollectionItem[];
    getFilteredByGlob: (glob: string) => CollectionItem[];
  };

  type Dir = {
    input?: string;
    includes?: string;
    layouts?: string;
    data?: string;
    output?: string;
  };
  type EventArgs = {
    dir: Dir;
    outputMode: "fs" | "json" | "ndjson";
    runMode: "build" | "watch" | "serve";
    results?: {
      inputPath: string;
      outputPath: string;
      url: string;
      content: string;
    }[];
  };

  export type EleventyConfig = {
    dir: Dir;
    dataTemplateEngine?: string;
    htmlTemplateEngine?: string;
    templateFormats?: string[];
    pathPrefix?: string;
    htmlOutputSuffix?: string;
    jsDataFileSuffix?: string;
    transforms?: object;

    setTemplateFormats: (formats: string | string[]) => void;
    setQuietMode: (mode: boolean) => void;
    addTransform: (content: string) => string;
    addLinter: (content: string) => void;

    addLiquidFilter: FilterFn;
    addNunjucksFilter: FilterFn;
    addHandlebarsHelper: FilterFn;
    addJavascriptFunction: FilterFn;
    addFilter: FilterFn;
    addAsyncFilter: FilterFn;

    addLiquidShortcode: FilterFn;
    addNunjucksShortcode: FilterFn;
    addHandlebarsShortcode: FilterFn;
    addShortcode: FilterFn;

    addPairedLiquidShortcode: FilterFn;
    addPairedNunjucksShortcode: FilterFn;
    addPairedHandlebarsShortcode: FilterFn;
    addPairedShortcode: PairedFn;

    addCollection: (
      name: string,
      fn: (collectionApi: CollectionApi) => any[]
    ) => void;

    namespace: (namespace: string, fn: Plugin) => void;
    addPlugin: Plugin;
    addGlobalData: (key: string, data: any) => void;
    addPassthroughCopy: (file: string | Object) => void;
    on: (
      event: "eleventy.before" | "eleventy.after" | "eleventy.beforeWatch",
      handler: (eventArgs: EventArgs) => void
    ) => void;
  };

  type EleventyBuildOptions = {
    quietMode?: boolean;
    configPath?: string;
    config?: (eleventyConfig: EleventyConfig) => void;
  };

  export default class Eleventy {
    constructor(input: string, output: string, options: EleventyBuildOptions);
    write(): Promise<void>;
  }
}
