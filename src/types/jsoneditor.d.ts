declare module "jsoneditor" {
  export type JSONEditorMode = "tree" | "view" | "form" | "code" | "text";

  export interface JSONEditorOptions {
    mode?: JSONEditorMode;
    modes?: JSONEditorMode[];
    name?: string;
    schema?: any;
    schemaRefs?: any;
    search?: boolean;
    history?: boolean;
    language?: string;
    mainMenuBar?: boolean;
    navigationBar?: boolean;
    statusBar?: boolean;
    onError?: (error: any) => void;
    onModeChange?: (newMode: JSONEditorMode, oldMode: JSONEditorMode) => void;
    onChangeText?: (jsonString: string) => void;
    onChange?: () => void;
  }

  export default class JSONEditor {
    constructor(
      container: HTMLElement,
      options?: JSONEditorOptions,
      json?: any
    );
    set(json: any): void;
    get(): any;
    setMode(mode: JSONEditorMode): void;
    getMode(): JSONEditorMode;
    destroy(): void;
  }
}
