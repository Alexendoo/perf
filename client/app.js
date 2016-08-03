/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />

require.config({ paths: { 'vs': '../node_modules/monaco-editor/dev/vs' } })
require(['vs/editor/editor.main'], main)

var state = new Object()

function main() {
  var editor = monaco.editor.create(document.getElementById('editor'), {
    value: '/// test\nfunction test () {\n  return \'hello world\'\n}',
    language: 'javascript'
  })

  window.addEventListener('resize', function () {
    editor.layout()
  })

  editor.onKeyDown(function (event) {
    onEnter(event, editor)
  })

  // DEBUG
  window.editor = editor
  window.model = model
}

/**
 * @param {monaco.IKeyboardEvent} event
 * @param {monaco.editor.IStandaloneCodeEditor} editor
 */
function onEnter(event, editor) {
  if (!event.altKey || event.browserEvent.code !== 'Enter') return

  var model = editor.getModel()
  // var oldDecorations = model.getAllDecorations()
  //   .map(function (decoration) {
  //     return decoration.id
  //   })

  var oldDecorations = state.oldDecorations || []

  var newDecorations = model.findMatches('test', false, false, false, false)
    .map(function (range) {
      return {
        range: {
          startLineNumber: range.startLineNumber,
          startColumn: 1,
          endLineNumber: range.endLineNumber,
          endColumn: 1
        },
        options: {
          linesDecorationsClassName: 'testDecoration',
          isWholeLine: true
        }
      }
    })

  state.oldDecorations = model.deltaDecorations(oldDecorations, newDecorations)
}