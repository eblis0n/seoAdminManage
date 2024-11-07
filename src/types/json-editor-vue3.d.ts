/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-11-07 19:49:26
 * @LastEditTime: 2024-11-07 19:49:42
 */
declare module 'json-editor-vue3' {
  import { Component } from 'vue'

  export interface JsonEditorOptions {
    mode?: 'tree' | 'code' | 'form' | 'text' | 'view'
    modes?: Array<'tree' | 'code' | 'form' | 'text' | 'view'>
    mainMenuBar?: boolean
    navigationBar?: boolean
    statusBar?: boolean
    search?: boolean
    history?: boolean
    language?: string
    indentation?: number
    theme?: string
  }

  export interface JsonEditorEvents {
    onChange?: (json: any) => void
    onError?: (error: any) => void
    onModeChange?: (newMode: string) => void
  }

  export interface JsonEditorProps {
    modelValue?: any
    options?: JsonEditorOptions
    height?: string | number
    width?: string | number
  }

  const JsonEditor: Component<JsonEditorProps>
  export default JsonEditor
} 
