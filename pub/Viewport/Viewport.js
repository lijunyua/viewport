"use strict";
(function (global, document) {
	// const log = console.log
	function _setUpViewportStyle() {
		// source: https://stackoverflow.com/questions/574944/how-to-load-up-css-files-using-javascript
		const cssId = "viewportStyle"
		if (!document.getElementById(cssId)) {
			var head  = document.getElementsByTagName('head')[0];
		    var link  = document.createElement('link');
		    link.id   = cssId;
		    link.rel  = 'stylesheet';
		    link.type = 'text/css';
		    link.href = './Viewport/style.css';
		    link.media = 'all';
		    head.appendChild(link);
		}
	}
	_setUpViewportStyle()

	function Viewport() {
		this.placeHolder = []
	}
	
	let _viewLists = []

	function _resetViewsByModeAndIndices(viewList, mode, resetIndices) {
		// Calling from save-reset, reset-default or change-mode
		let thisViewListObject = null
		_viewLists.forEach(function (thisViewList) {
			if (thisViewList.viewList === viewList) {
				thisViewListObject = thisViewList
			}
		})
		const wrapperList = thisViewListObject.wrapperList
		thisViewListObject.currentReorderMode = mode
		thisViewListObject.currentIndices = resetIndices
		// Remove all current wrappers in viewList and add according to new indices
		while (viewList.firstChild) {
			viewList.removeChild(viewList.lastChild)
		}
		for (let i = 0; i < thisViewListObject.currentIndices.length; i++) {
			viewList.appendChild(wrapperList[thisViewListObject.currentIndices[i]])
		}
	}

	function _manageIndices(indices, selectedIndex, putdownIndex, mode) {
		if (selectedIndex === putdownIndex) {
			return indices
		}
		let newIndices = []
		if (mode === 'reorder') {
			let indicesToMove = []
			if (selectedIndex < putdownIndex) {
				indicesToMove = indices.slice(selectedIndex + 1, putdownIndex + 1)
				newIndices = indices.slice(0, selectedIndex)
									.concat(indicesToMove)
									.concat([indices[selectedIndex]])
									.concat(indices.slice(putdownIndex + 1))
			} else {
				indicesToMove = indices.slice(putdownIndex, selectedIndex)
				newIndices = indices.slice(0, putdownIndex)
									.concat([indices[selectedIndex]])
									.concat(indicesToMove)
									.concat(indices.slice(selectedIndex + 1))
			}
		}
		if (mode === 'swap') {
			newIndices = indices
			const temp = newIndices[putdownIndex]
			newIndices[putdownIndex] = newIndices[selectedIndex]
			newIndices[selectedIndex] = temp
		}
		
		//log("new ordering", newIndices)
		return newIndices
	}

	function _setDefaultViewStyle(wrapper) {
		wrapper.style.borderWidth = '8px'
		wrapper.style.borderStyle = 'solid'
		wrapper.style.borderColor = 'white'
	}

	function _setDefaultHighlightStyle(wrapper) {
		wrapper.style.borderColor = 'yellow'
	}

	function _setDefaultSelectStyle(wrapper) {
		wrapper.style.borderColor = 'green'
	}

	Viewport.prototype = {

		makeView: function(viewList, allViews, dimensions=null, setViewStyle=_setDefaultViewStyle, 
						   setHighlightStyle=_setDefaultHighlightStyle, setSelectStyle=_setDefaultSelectStyle) {

			let views = []
			
			allViews.forEach(function (view) {
				if (viewList.contains(view)) {
					views.push(view)
				}
			})
			views.forEach(function (view) {
				view.classList.add('viewport')
			})

			// Create a wrapper div for each view
			let wrapper = null
			let parent = null
			let thisElement = null
			let wrapperList = []
			for (let i = 0; i < views.length; i++) {
				// Makes sure each wrapper is direct child of viewList
				thisElement = views[i]
				parent = views[i].parentElement
				while (parent !== viewList) {
					parent = parent.parentElement
					thisElement = thisElement.parentElement
				}
				wrapper = document.createElement("div")
				wrapper.classList.add('viewContainer')
				wrapper.appendChild(thisElement)
				wrapperList.push(wrapper)
				parent.appendChild(wrapper)
			}

			if (dimensions !== null) {
				if (dimensions.length !== views.length) {
					throw "Input dimension length not equal to number of view-classed elements"
				}
				for (let i = 0; i < views.length; i++) {
					if (dimensions[i].length !== 2) {
						throw "Input inner dimension length not equal to 2"
					}
					wrapperList[i].style.width = dimensions[i][0].toString().concat('%')
					wrapperList[i].style.paddingBottom = dimensions[i][1].toString().concat('%')
				}
			}
			for (let i = 0; i < views.length; i++) {
				setViewStyle(wrapperList[i])
			}

			let indices = []
			for (let i = 0; i < wrapperList.length; i++) {
				indices.push(i)
			}

			_viewLists.push({
				viewList: viewList,
				dimensions: dimensions,
				wrapperList: wrapperList,
				setViewStyle: setViewStyle,
				setHighlightStyle: setHighlightStyle,
				setSelectStyle: setSelectStyle,
				currentReorderMode: null,
				currentIndices: indices,
				allSavedIndices: []
			})
		},

		makeViewClosable: function (viewList, closableViewList) {
			let thisViewListObject = null
			_viewLists.forEach(function (thisViewList) {
				if (thisViewList.viewList === viewList) {
					thisViewListObject = thisViewList
				}
			})
			const wrapperList = thisViewListObject.wrapperList

			let closableWrapperList = []
			let closableWrapperListIndices = []
			for (let i = 0; i < wrapperList.length; i++) {
				closableViewList.forEach(function (thisView) {
					if (wrapperList[i].contains(thisView)) {
						closableWrapperList.push(wrapperList[i])
						closableWrapperListIndices.push(i)
					}
				})
			}

			let closingView = false
			for (let i = 0; i < closableWrapperList.length; i++) {
				let closeButton = document.createElement("span")
				closeButton.textContent = "\u274e"
				closeButton.classList.add('viewCloseButton')
				closeButton.addEventListener('mousedown', function(e) {
					// close view with left mouse button click only
					e.stopPropagation()
					const buttonCode = (e || window.event).button
					if (buttonCode === 0) {
						closingView = true
					}
				})
				closeButton.addEventListener('mouseout', function() {
					if (closingView === true) {
						closingView = false
					}
				})
				closeButton.addEventListener('mouseup', function(e) {
					e.stopPropagation()
					if (closingView === true) {
						const index = thisViewListObject.currentIndices.indexOf(closableWrapperListIndices[i])
						thisViewListObject.currentIndices.splice(index, 1)
						//log("deleted element %d at position %d", closableWrapperListIndices[i], index)
						//log("new ordering", thisViewListObject.currentIndices)
						viewList.removeChild(closableWrapperList[i])
						closingView = false
						
					}
				})

				closableWrapperList[i].appendChild(closeButton)
			}
		},

		// Rules of reordering:
		// In reorder mode:
		// 1. If the difference in index between the two divs is 1, a swap will occur
		// 2. Inserting to a lower index "pushes" elements after it forward
		// 3. Inserting to a higher index "pulls" the elements before it back
		// In swap mode:
		// A swap will always occur between the selected and putdown views
		// 
		// ----------------------------------------------------------------------------------
		// Warning: do not add sibling element with class view to any element with class view
		// unless their common parent is viewList
		// ----------------------------------------------------------------------------------
		makeViewReorderable: function (viewList, mode='reorder') {
			// Find object of this view list in global viewlists
			let thisViewListObject = null
			_viewLists.forEach(function (thisViewList) {
				if (thisViewList.viewList === viewList) {
					thisViewListObject = thisViewList
				}
			})
			const wrapperList = thisViewListObject.wrapperList
			const setViewStyle = thisViewListObject.setViewStyle
			const setHighlightStyle = thisViewListObject.setHighlightStyle
			const setSelectStyle = thisViewListObject.setSelectStyle
			thisViewListObject.currentReorderMode = mode

			let selected = null
			let selectedIndex = null
			let putdown = null
			let putdownIndex = null

			for (let i = 0; i < wrapperList.length; i++) {
				wrapperList[i].addEventListener('mouseover', function handleMouseOver(e) {
					// If hover without holding left mouse button, reset selected
					if (e.buttons != 1 && e.buttons != 3) {
						selected = null
						selectedIndex = null
					}
					setHighlightStyle(wrapperList[i])
					if (selected !== null) {
						setSelectStyle(selected)
					}
				}, false)
				wrapperList[i].addEventListener('mouseout', function handleMouseOut(e) {
					setViewStyle(wrapperList[i])
					if (selected !== null) {
						setViewStyle(selected)
					}
				}, false)
			}

			for (let i = 0; i < wrapperList.length; i++) {
				wrapperList[i].addEventListener('mousedown', function handleMouseDown(e) {
					e.preventDefault()
					// make sure selected the wrapper
					selected = e.target
					while (!selected.classList.contains("viewContainer")) {
						selected = selected.parentElement
					}
					selectedIndex = thisViewListObject.currentIndices.indexOf(i)

					// set select style with left mouse button click only
					const buttonCode = (e || window.event).button
					if (buttonCode === 0) {
						setSelectStyle(wrapperList[i])
					}
					
					//log("selected element %d at position %d", i, selectedIndex)
				}, false)
				wrapperList[i].addEventListener('mouseup', function handleMouseUp(e) {
					e.preventDefault()
					// make sure putting down on wrapper
					putdown = e.target
					while (!putdown.classList.contains("viewContainer")) {
						putdown = putdown.parentElement
					}
					putdownIndex = thisViewListObject.currentIndices.indexOf(i)

					// If clicked on a view and it is hyperlinked, go to link
					if (selected === putdown) {
						const linkElement = selected.firstChild
						linkElement.click()
					}
					if (selected !== null) {

						// reset style with left mouse button release only
						const buttonCode = (e || window.event).button
						if (buttonCode === 0) {
							setViewStyle(selected)
						}	
						if (thisViewListObject.currentReorderMode === 'reorder') {
							if (putdownIndex < selectedIndex || putdownIndex === 0) {
								viewList.insertBefore(selected, putdown)
							}
							else {
								viewList.insertBefore(selected, putdown.nextSibling)
							}
						}
						if (thisViewListObject.currentReorderMode === 'swap') {
							if (putdownIndex === selectedIndex - 1) {
								viewList.insertBefore(selected, putdown)
							} else if (putdownIndex === selectedIndex + 1) {
								viewList.insertBefore(putdown, selected)
							} else {
								const selectedNextSibling = selected.nextSibling
								const putdownNextSibling = putdown.nextSibling
								viewList.insertBefore(selected, putdownNextSibling)
								viewList.insertBefore(putdown, selectedNextSibling)
							}
						}
						//log("put at element %d at position %d", i, putdownIndex)
						thisViewListObject.currentIndices = 
						_manageIndices(thisViewListObject.currentIndices, selectedIndex, putdownIndex, 
						thisViewListObject.currentReorderMode)

						selectedIndex = null
						putdownIndex = null
						selected = null
						putdown = null
					}

				}, false)
			}
		},

		// Sets up the save, reset functionality of the ordering
		// buttons: 2d list, each sub-list must be HTML elements of a save-reset pair of buttons
		setUpSaveAndResetButtons: function (viewList, buttons) {
			let thisViewListObject = null
			_viewLists.forEach(function (thisViewList) {
				if (thisViewList.viewList === viewList) {
					thisViewListObject = thisViewList
				}
			})
			const wrapperList = thisViewListObject.wrapperList

			for (let i = 0; i < buttons.length; i++) {
				thisViewListObject.allSavedIndices.push({})
			}

			for (let i = 0; i < buttons.length; i++) {
				if (buttons[i].length !== 2) {
					throw "buttons inner dimension length not equal to 2"
				}
				buttons[i][0].addEventListener('click', function() {
					const thisViewListObjectClone = JSON.parse(JSON.stringify(thisViewListObject))
					thisViewListObject.allSavedIndices[i] = {
						indices: thisViewListObjectClone.currentIndices,
						mode: thisViewListObjectClone.currentReorderMode
					}
				})
				buttons[i][1].addEventListener('click', function() {
					const thisViewListObjectClone = JSON.parse(JSON.stringify(thisViewListObject))
					_resetViewsByModeAndIndices(viewList, thisViewListObjectClone.allSavedIndices[i].mode,
										thisViewListObjectClone.allSavedIndices[i].indices)
				})

			}
		},

		setUpResetDefaultButton: function (viewList, button) {
			let thisViewListObject = null
			_viewLists.forEach(function (thisViewList) {
				if (thisViewList.viewList === viewList) {
					thisViewListObject = thisViewList
				}
			})
			const wrapperList = thisViewListObject.wrapperList
			let indices = []
			for (let i = 0; i < wrapperList.length; i++) {
				indices.push(i)
			}
			button.addEventListener('click', function() {
				const indicesClone = JSON.parse(JSON.stringify(indices))
				const thisViewListObjectClone = JSON.parse(JSON.stringify(thisViewListObject))
				_resetViewsByModeAndIndices(viewList, thisViewListObjectClone.currentReorderMode, indicesClone)
			})
		},

		setUpChangeOrderingMethodButton: function (viewList, button) {
			let thisViewListObject = null
			_viewLists.forEach(function (thisViewList) {
				if (thisViewList.viewList === viewList) {
					thisViewListObject = thisViewList
				}
			})
			button.addEventListener('click', function() {
				const thisViewListObjectClone = JSON.parse(JSON.stringify(thisViewListObject))
				let orderingMethod = null
				if (thisViewListObjectClone.currentReorderMode === 'swap') {
					orderingMethod = 'reorder'
				} else {
					orderingMethod = 'swap'
				}
				thisViewListObject.currentReorderMode = orderingMethod
				if (orderingMethod === 'reorder') {
					orderingMethod = 'default'
				}
				button.textContent = "Reordering: ".concat(orderingMethod)
			})
		}
	}
	global.Viewport = global.Viewport || Viewport
}) (window, window.document);