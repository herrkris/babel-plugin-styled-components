import * as t from 'babel-types'
import { isStyled, isCSSHelper, isKeyframesHelper, isInjectGlobalHelper } from '../../utils/detectors'
import preprocessStyled from '../../css/preprocessStyled'
import preprocessCSS from '../../css/preprocessCSS'
import preprocessKeyframes from '../../css/preprocessKeyframes'
import preprocessInjectGlobal from '../../css/preprocessInjectGlobal'

export default (path, state, componentId) => {
  const _isStyled = isStyled(path.node.tag, state)
  const _isCSSHelper = isCSSHelper(path.node.tag, state)
  const _isKeyframesHelper = isKeyframesHelper(path.node.tag, state)
  const _isInjectGlobalHelper = isInjectGlobalHelper(path.node.tag, state)

  if (
    _isStyled ||
    _isCSSHelper ||
    _isInjectGlobalHelper ||
    _isKeyframesHelper
  ) {
    const { tag: callee, quasi: { quasis, expressions }} = path.node
    const values = quasis.map(quasi => quasi.value.cooked)

    let result
    if (_isStyled) {
      result = preprocessStyled(values, expressions, componentId)
    } else if (_isCSSHelper) {
      result = preprocessCSS(values, expressions)
    } else if (_isInjectGlobalHelper) {
      result = preprocessInjectGlobal(values, expressions)
    } else {
      // _isKeyframesHelper
      result = preprocessKeyframes(values, expressions)
    }

    path.replaceWith(t.callExpression(callee, [ result ]))
  }
}
