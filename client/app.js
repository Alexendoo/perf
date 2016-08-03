/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />

require.config({ paths: { 'vs': '../node_modules/monaco-editor/dev/vs' }})
require(['vs/editor/editor.main'], main)

function main () {
  var editor = monaco.editor.create(document.getElementById('editor'), {
    value: '/// test\nfunction test () {\n  return \'hello world\'\n}',
    language: 'javascript'
  })

  window.addEventListener('resize', function () {
    editor.layout()
  })

  var model = editor.getModel()
  var matches = model.findMatches('test', false, false, false, false)

  editor.onKeyDown(onEnter)

  console.table(matches)

  // DEBUG
  window.editor = editor
  window.model = model
}

function onEnter (event) {
  if (!event.altKey || event.browserEvent.code !== 'Enter') return

  console.log('!!!!')
}