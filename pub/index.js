"use strict";

const viewport = new Viewport()

function example1() {
	const myViewList = document.querySelector("#myViewList1")
	const allViews = document.querySelectorAll(".myView1")
	const allViewsCloseButton = document.querySelectorAll(".myViewCloseButton1")

	// Must have a length equal to number of view classes under this selected viewList
	// Each subarray must have a length
	const myViewListDimensions = [[10, 10], [10, 10], [10, 10], [10, 10], [10, 10], [10, 10]]

	viewport.makeView(myViewList, allViews, myViewListDimensions)
	viewport.makeViewReorderable(myViewList, 'swap')
	viewport.makeViewClosable(myViewList, allViewsCloseButton)

	const myViewListSave1 = document.querySelector("#myViewList1Save1")
	const myViewListReset1 = document.querySelector("#myViewList1Reset1")
	const myViewListSave2 = document.querySelector("#myViewList1Save2")
	const myViewListReset2 = document.querySelector("#myViewList1Reset2")
	const myViewListButtons = [[myViewListSave1, myViewListReset1], [myViewListSave2, myViewListReset2]]

	viewport.setUpSaveAndResetButtons(myViewList, myViewListButtons)

	const myViewListResetDefault = document.querySelector("#myViewList1ResetDefault")
	viewport.setUpResetDefaultButton(myViewList, myViewListResetDefault)

	const myViewListChangeOrderingMethod = document.querySelector("#myViewList1ChangeOrderingMethod")
	viewport.setUpChangeOrderingMethodButton(myViewList, myViewListChangeOrderingMethod)
}
example1()

//-------------------------------------------------------------------------------------------------------------------
function example2() {
	const myViewList = document.querySelector("#myViewList2")
	const allViews = document.querySelectorAll(".myView2")
	viewport.makeView(myViewList, allViews)
}
example2()

//-------------------------------------------------------------------------------------------------------------------

function example3() {
	const myViewList = document.querySelector("#myViewList3")
	const allViews = document.querySelectorAll(".myView3")
	viewport.makeView(myViewList, allViews)
	viewport.makeViewReorderable(myViewList, 'reorder')
}
example3()

//-------------------------------------------------------------------------------------------------------------------

function example4() {
	const myViewList = document.querySelector("#myViewList4")
	const allViews = document.querySelectorAll(".myView4")
	viewport.makeView(myViewList, allViews)
	viewport.makeViewReorderable(myViewList, 'swap')
}
example4()

//-------------------------------------------------------------------------------------------------------------------

function example5() {
	const myViewList = document.querySelector("#myViewList5")
	const allViews = document.querySelectorAll(".myView5")
	const myViewListDimensions = [[20, 20], [20, 20], [10, 10], [10, 10], [10, 10], [10, 10]]
	viewport.makeView(myViewList, allViews, myViewListDimensions)
	viewport.makeViewReorderable(myViewList, 'swap')
}
example5()

//-------------------------------------------------------------------------------------------------------------------

function example6() {
	const myViewList = document.querySelector("#myViewList6")
	const allViews = document.querySelectorAll(".myView6")

	function myViewStyle(wrapper) {
		wrapper.style.opacity = 1
	}
	function myHighlightStyle(wrapper) {
		wrapper.style.opacity = 0.1
	}
	function mySelectStyle(wrapper) {
		wrapper.style.opacity = 0.6
	}

	viewport.makeView(myViewList, allViews, null, myViewStyle, myHighlightStyle, mySelectStyle)
	viewport.makeViewReorderable(myViewList, 'swap')
}
example6()

//-------------------------------------------------------------------------------------------------------------------

function example7() {
	const myViewList = document.querySelector("#myViewList7")
	const allViews = document.querySelectorAll(".myView7")
	const allViewsCloseButton = document.querySelectorAll(".myViewCloseButton7")
	viewport.makeView(myViewList, allViews)
	viewport.makeViewClosable(myViewList, allViewsCloseButton)
}
example7()

//-------------------------------------------------------------------------------------------------------------------

function example8() {
	const myViewList = document.querySelector("#myViewList8")
	const allViews = document.querySelectorAll(".myView8")
	const allViewsCloseButton = document.querySelectorAll(".myViewCloseButton8")

	viewport.makeView(myViewList, allViews)
	viewport.makeViewReorderable(myViewList, 'swap')
	viewport.makeViewClosable(myViewList, allViewsCloseButton)

	const myViewListSave1 = document.querySelector("#myViewList8Save1")
	const myViewListReset1 = document.querySelector("#myViewList8Reset1")
	const myViewListSave2 = document.querySelector("#myViewList8Save2")
	const myViewListReset2 = document.querySelector("#myViewList8Reset2")
	const myViewListSave3 = document.querySelector("#myViewList8Save3")
	const myViewListReset3 = document.querySelector("#myViewList8Reset3")
	const myViewListButtons = [[myViewListSave1, myViewListReset1],
							   [myViewListSave2, myViewListReset2],
							   [myViewListSave3, myViewListReset3]]

	viewport.setUpSaveAndResetButtons(myViewList, myViewListButtons)

	const myViewListResetDefault = document.querySelector("#myViewList8ResetDefault")
	viewport.setUpResetDefaultButton(myViewList, myViewListResetDefault)

	const myViewListChangeOrderingMethod = document.querySelector("#myViewList8ChangeOrderingMethod")
	viewport.setUpChangeOrderingMethodButton(myViewList, myViewListChangeOrderingMethod)
}
example8()