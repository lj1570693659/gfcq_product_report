(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-25e7c8d2"],{"1b27":function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("el-table",{ref:"lendontable",staticStyle:{width:"100%"},attrs:{data:e.renderDynamic,border:"","default-expand-all":"","row-key":"cid","row-class-name":e.rowClassNameFun,"header-cell-style":{background:"#fafafa"}},on:{select:e.selectFun}},[n("el-table-column",{attrs:{prop:"name",label:"项目名称",sortable:""}}),e._v(" "),n("el-table-column",{attrs:{prop:"shouldSubmitNumber",label:"应提交数量",sortable:""}}),e._v(" "),n("el-table-column",{attrs:{prop:"realSubmitNumber",label:"实际提交数量",sortable:""}}),e._v(" "),n("el-table-column",{attrs:{label:"操作",align:e.alignDir,width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[1!=t.row.type?n("el-button",{attrs:{type:"text",size:"small"},on:{click:function(n){return e.handleUpdate(t.row)}}},[e._v("详情")]):e._e(),e._v(" "),1!=t.row.type?n("el-button",{attrs:{type:"text",size:"small"},on:{click:function(n){return e.handleTask(t.row)}}},[e._v("任务")]):e._e(),e._v(" "),1!=t.row.type?n("el-button",{attrs:{type:"text",size:"small"},on:{click:function(n){return e.handleAggre(t.row)}}},[e._v("交付物汇总")]):e._e(),e._v(" "),1!=t.row.type?n("el-button",{attrs:{type:"text",size:"small"},on:{click:function(n){return e.handleDepart(t.row)}}},[e._v("各部门提交")]):e._e()]}}])})],1)],1)},c=[],i=(n("6762"),n("ac6a"),n("211e")),a={name:"App",data:function(){return{renderDynamic:[],selectArr:[],locationData:[],alignDir:"center",textMap:{update:"编辑",create:"添加"},dialogStatus:"",dialogFormVisible:!1,temp:{},rules:{}}},created:function(){var e=this,t=this.$route.query.cid;Object(i["c"])({cid:t}).then((function(t){e.renderDynamic=t,e.locationData.push({CID:"0-0",CNAME:"顶层目录"}),e.initData(e.renderDynamic)}))},methods:{getSelectId:function(e){var t=this;e.forEach((function(e){!0===e.isSelect?(t.selectArr.push(e.id),e.children&&e.children.length&&t.getSelectId(e.children)):""===e.isSelect&&t.getSelectId(e.children)}))},initData:function(e){var t=this;e.forEach((function(e){e.isSelect=!1,e.children&&e.children.length&&t.initData(e.children),t.locationData.push({CID:e.CID,CNAME:e.CNAME})}))},selectFun:function(e,t){this.setRowIsSelect(t)},rowClassNameFun:function(e){var t=e.row;if(""===t.isSelect)return"indeterminate"},headerRowClassName:function(e){e.row;var t=[];return this.renderDynamic.forEach((function(e){t.push(e.isSelect)})),t.includes("")?"indeterminate":""},handleCreate:function(){var e=this;this.dialogFormVisible=!0,this.dialogStatus="create",this.$nextTick((function(){e.$refs["dataForm"].clearValidate()}))},handleUpdate:function(e){this.$router.push({path:"/achieve/product",query:{cid:e.cid}})},handleTask:function(e){this.$router.push({path:"/achieve/task",query:{cid:e.cid}})},handleAggre:function(e){this.$router.push({path:"/achieve/statistics",query:{cid:e.cid}})},handleDepart:function(e){this.$router.push({path:"/achieve/depart",query:{cid:e.cid}})},setRowIsSelect:function(e){""===e.isSelect&&(e.isSelect=!1,this.$refs.lendontable.toggleRowSelection(e,!0)),e.isSelect=!e.isSelect;var t=this;function n(r){r.forEach((function(r){r.isSelect=e.isSelect,t.$refs.lendontable.toggleRowSelection(r,e.isSelect),r.children&&r.children.length&&n(r.children)}))}function r(e,t){return t.forEach((function(t){e.push(t.isSelect),t.children&&t.children.length&&r(e,t.children)})),e}function c(e){return 0==e.parentId?e.children&&e.children.length?1:4:e.children&&e.children.length?2:3}var i={};function a(e,t){return e.forEach((function(e){e.id==t&&(i=e),e.children&&e.children.length&&a(e.children,t)})),i}function l(e){var n=[],c=a(t.renderDynamic,e.parentId);n=r(n,c.children),n.every((function(e){return 1==e}))?(c.isSelect=!0,t.$refs.lendontable.toggleRowSelection(c,!0)):n.every((function(e){return 0==e}))?(c.isSelect=!1,t.$refs.lendontable.toggleRowSelection(c,!1)):c.isSelect="",0!=c.parentId&&l(c)}var o=c(e);1==o?n(e.children):2==o?(n(e.children),l(e)):3==o&&l(e)}}},l=a,o=(n("467f6"),n("0c7c")),u=Object(o["a"])(l,r,c,!1,null,null,null);t["default"]=u.exports},"211e":function(e,t,n){"use strict";n.d(t,"h",(function(){return c})),n.d(t,"a",(function(){return i})),n.d(t,"c",(function(){return a})),n.d(t,"g",(function(){return l})),n.d(t,"d",(function(){return o})),n.d(t,"e",(function(){return u})),n.d(t,"f",(function(){return s})),n.d(t,"b",(function(){return d}));var r=n("b775");function c(e){return Object(r["a"])({url:"/plm/product/task",method:"get",params:e})}function i(e){return Object(r["a"])({url:"/plm/product/taskCount",method:"get",params:e})}function a(e){return Object(r["a"])({url:"/plm/doc/lists",method:"get",params:e})}function l(e){return Object(r["a"])({url:"/plm/doc/task",method:"get",params:e})}function o(e){return Object(r["a"])({url:"/plm/doc/compute",method:"get",params:e})}function u(e){return Object(r["a"])({url:"/plm/doc/statistics",method:"get",params:e})}function s(e){return Object(r["a"])({url:"/plm/doc/product_statistics",method:"get",params:e})}function d(e){return Object(r["a"])({url:"/plm/doc/depart_statistics",method:"get",params:e})}},"467f6":function(e,t,n){"use strict";n("b7ab")},6762:function(e,t,n){"use strict";var r=n("5ca1"),c=n("c366")(!0);r(r.P,"Array",{includes:function(e){return c(this,e,arguments.length>1?arguments[1]:void 0)}}),n("9c6c")("includes")},b7ab:function(e,t,n){}}]);