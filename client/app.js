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
 * @param {number} startLine
 */
function highlightFunction (model, startLine) {
  var endLine = startLine - 1
  var eof = model.getFullModelRange().endLineNumber

  var braces = 0

  // TODO: replace with IModel.tokenIterator

  do {
    var line = model.getLineContent(++endLine)
    var char = line.length

    while (char--) {
      if (line[char] === '{') braces++
      else if (line[char] === '}') braces--
    }
  } while (braces && endLine <= eof)

  var range = new monaco.Range(startLine, 1, endLine, 1)
  return range
}