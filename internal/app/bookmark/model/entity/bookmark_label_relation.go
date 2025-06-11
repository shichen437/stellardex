// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// BookmarkLabelRelation is the golang structure for table bookmark_label_relation.
type BookmarkLabelRelation struct {
	Id         int `json:"id"         orm:"id"          description:""`
	BookmarkId int `json:"bookmarkId" orm:"bookmark_id" description:""`
	LabelId    int `json:"labelId"    orm:"label_id"    description:""`
}
