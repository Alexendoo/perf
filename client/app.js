/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />

require.config({ paths: { 'vs': '../node_modules/monaco-editor/dev/vs' } })
require(['vs/editor/editor.main'], main)

var state = new Object()

function main () {
  var editor = monaco.editor.create(document.getElementById('editor'), {
    value: '/// test\nfunction test () {\n  return \'hello world\'\n}',
    language: 'javascript'
  })

  window.addEventListener('resize', function () {
    editor.layout()
  })

  editor.onKeyDown(function (event) {
    if (!event.altKey || event.browserEvent.code !== 'Enter') return
    onEnter(editor)
  })

  // DEBUG
  window.monaco = monaco
  window.editor = editor
  window.model = editor.getModel()
}

/**
 * @param {monaco.editor.IStandaloneCodeEditor} editor
 */
function onEnter (editor) {
  var model = editor.getModel()

  var oldDecorations = state.oldDecorations || []

  var newDecorations = model.findMatches('///\\s*test', false, true, false, false)
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
          isWholeLine: true,
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        }
      }
    })

  state.oldDecorations = model.deltaDecorations(oldDecorations, newDecorations)
}

/**
 * @param {monaco.editor.IModel} model
 * @param {monaco.IPosition} startPosition
 * @param {function} range - callback returning a range covered by
 *                           the next function from {@code start}
 */
function getFunctionRange (model, startPosition, range) {
  model.tokenIterator(startPosition, function (iterator) {
    while (iterator.hasNext()) {
      var tokenIteration = iterator.next()
      var token = tokenIteration.token

      if (!token.type.startsWith('delimiter')) continue
      console.log(token)
    }
  })
}