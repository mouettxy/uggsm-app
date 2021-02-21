/**
 *
 * Refers to ts-loader [issue #653](https://github.com/TypeStrong/ts-loader/issues/653)
 *
 * Code tooked from [comment #712162360](https://github.com/TypeStrong/ts-loader/issues/653#issuecomment-712162360)
 *
 * Removed webpack types to work with vue.config.js file and changed 'reexported as' to 'imported as'
 *
 */
module.exports = class IgnoreNotFoundExportPlugin {
  apply(compiler) {
    const messageRegExp = /export '.*'( \(imported as '.*'\))? was not found in/
    const doneHook = (stats) =>
      (stats.compilation.warnings = stats.compilation.warnings.filter(
        (warn) =>
          // Unfortunately webpack is not exporting ModuleDependencyWarning type, so I'm using constructor.name instead
          warn.constructor.name === 'ModuleDependencyWarning' && !messageRegExp.test(warn.message)
      ))

    compiler.hooks.done.tap('IgnoreNotFoundExportPlugin', doneHook)
  }
}
