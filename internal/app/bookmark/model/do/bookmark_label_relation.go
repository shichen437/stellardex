// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
)

// BookmarkLabelRelation is the golang structure of table bookmark_label_relation for DAO operations like Where/Data.
type BookmarkLabelRelation struct {
	g.Meta     `orm:"table:bookmark_label_relation, do:true"`
	Id         interface{} //
	BookmarkId interface{} //
	LabelId    interface{} //
}
