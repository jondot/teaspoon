React TestUtils utils
========

A simple jquery like api wrapper for the React TestUtils to make them a bit friendlier to use.

Updates for react 0.14, works with Stateless Components and you can scry and filter on DOM components
as well.

### Traditional DOM rendering

```js
var $r = require('react-testutil-query')

var elements = (
        <MyComponent>
            <MyInput/>
            <div className='fun-div'>
            <MyInput/>
        </MyComponent>
    )

var $root = $r(elements) // renders and returns a wrapped instance

$r($root)    // | calling it again won't rerender or rewrap
$r($root[0]) // |

//-- simple selector syntax --
$root.find('.fun-div') //class
$root.find('div')      // tag name
$root.find(MyInput)    // component type

$root.find(':dom')        // all dom nodes
$root.find(':composite')  // all non DOM components

$root.find()  // everything! all descendents

//-- like jquery you get an arraylike thing
$root.find(MyInput).length // 2

$root.find(MyInput).each( (component, idx) => /*do something */)

// use the index or `get()` to unwrap the collection into a single component or real array
$root.find('.fun-div')[0]


$root.find(MyInput).first()
$root.find(MyInput).last()

// you can still get the implicit asserts for finding single components
$root.find('.fun-div').only() // throws a TypeError .length === 0
$root.single('.fun-div')      // is the same thing


// -- getting DOM nodes
$root.single('.fun-div').dom() // returns the single DOM node
$root.find(MyInput).dom() //returns an array of DOM nodes

// -- events
$root.find(MyInput).trigger('change', { target: { value: 6 }}) // triggers onChange for all of them
```

### Shallow rendering

We can use an even more powerful selector syntax will shallow rendering

```js
var $ = require('react-testutil-query/shallow');

let label = 'list item';

let BasicList = props => <ul>{props.children}</ul>

let DivList = ()=> (
  <div>
    <BasicList className='my-list'>
      <li className='foo'>hi 1</li>
      <li className='foo'>hi 2</li>
      <li aria-label={label}>hi 3</li>
    </BasicList>
  </div>
)


let $root = $(<DivList);

$root.find('.my-list > li.foo').length // 2

$root.find('.my-list').children('.foo').length // 2

$root.find('div li[aria-label="list item"]').length // 1

// you can even use es6 template strings to write
// selectors for your custom components
$root.find($.s`${BasicList} > li.foo`).length // 2

//or for prop values
$root.find($.s`li[aria-label=${label}]`).length // 1

$root.find(BasicList)
  .children()
  .filter(element => element.props.className === 'foo')
  .length // 2

$root.find(BasicList).is('.my-list').length // true

```
