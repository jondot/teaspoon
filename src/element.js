import React, { isValidElement, cloneElement } from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from'react-addons-test-utils';
import createQueryCollection from './QueryCollection';
import iQuery from './instance'
import * as utils from './utils';
import { selector } from 'bill';

let isComponent = el => utils.isDOMComponent(el) || utils.isCompositeComponent(el)

let eQuery = createQueryCollection(utils.match, selector, function init(elements, context){
  let first = elements.filter(e => !!e)[0];
  if (first && isComponent(first))
    return iQuery(elements);

  return elements.filter(el => isValidElement(el))
})

Object.assign(eQuery.fn, {

  _reduce: eQuery.fn.reduce,

  render(intoDocument, mountPoint){
    var mount = mountPoint || document.createElement('div')
      , element = this[0];

    if (intoDocument)
      document.body.appendChild(mount)

    let instance = ReactDOM.render(element, mount);

    if (instance === null)
      instance = ReactDOM.render(utils.wrapStateless(element), mount)

    return iQuery(instance, utils.getInternalInstance(instance), mount);
  },

  shallowRender(props) {
    if (!this.length) return this

    let element = this[0];
    let isDomElement = typeof element.type === 'string' && element.type.toLowerCase() === element.type;

    if (props)
      element = cloneElement(element, props)

    if (isDomElement)
      return eQuery(element)

    if(!this.renderer)
      this.renderer = ReactTestUtils.createRenderer()

    this.renderer.render(element)
    return eQuery(this.renderer.getRenderOutput());
  },

  children(selector) {
    return this
      .reduce((result, element) => result.concat(element.props.children || []), [])
      .filter(selector)
  },

  text(){
    let isText = el => typeof el === 'string';

    return this.get().reduce((str, element)=> {
      return str + utils.traverse(element, isText).join('')
    }, '')
  }

})

export default eQuery;
