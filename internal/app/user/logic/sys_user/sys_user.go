package logic

import (
	"context"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/util/gconv"
	v1 "github.com/shichen437/stellardex/api/v1/user"
	commonConsts "github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/user/dao"
	"github.com/shichen437/stellardex/internal/app/user/model"
	"github.com/shichen437/stellardex/internal/app/user/model/do"
	"github.com/shichen437/stellardex/internal/app/user/model/entity"
	"github.com/shichen437/stellardex/internal/app/user/service"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

type (
	sSysUser struct{}
)

func init() {
	service.RegisterSysUser(New())
}

func New() service.ISysUser {
	return &sSysUser{}
}

func (s *sSysUser) GetUserInfo(ctx context.Context, req *v1.GetUserInfoReq) (res *v1.GetUserInfoRes, err error) {
	res = &v1.GetUserInfoRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		return
	}
	user := getUserById(ctx, uid)
	if user == nil {
		return
	}
	role, err := service.SysRole().GetUserRole(ctx, user.Id)
	if err != nil || role == nil {
		return
	}
	var userInfo *model.UserInfo
	gconv.Struct(user, &userInfo)
	if role.Id == commonConsts.SuperRoleId {
		userInfo.IsAdmin = true
	}
	userInfo.RoleId = role.Id
	userInfo.RoleName = role.RoleName
	res.UserInfo = userInfo
	return
}

func (s *sSysUser) List(ctx context.Context, req *v1.GetUserListReq) (res *v1.GetUserListRes, err error) {
	res = &v1.GetUserListRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if !hasUserPermit(ctx, uid) {
		err = gerror.New("auth.NoPermission")
		return
	}
	m := dao.SysUser.Ctx(ctx).
		WhereNot(dao.SysUser.Columns().Id, commonConsts.SuperAdminId).
		OrderAsc(dao.SysUser.Columns().Id)
	res.Total, err = m.Count()
	var list []*model.UserInfo
	if res.Total > 0 {
		err = m.Page(req.PageNum, req.PageSize).Scan(&list)
		if err != nil {
			err = gerror.New("获取用户列表失败")
			return
		}
		fillRoleFields(ctx, list)
		gconv.Structs(list, &res.Rows)
	}
	return
}

func (s *sSysUser) Add(ctx context.Context, req *v1.PostUserReq) (res *v1.PostUserRes, err error) {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if !hasUserPermit(ctx, uid) {
		err = gerror.New("auth.NoPermission")
		return
	}
	if !checkUsername(ctx, req.Username, 0) {
		err = gerror.New("user.valid.UserNameExist")
		return
	}
	if !checkNickname(ctx, req.Nickname, 0) {
		err = gerror.New("user.valid.NickNameExist")
		return
	}
	enc, _ := utils.Encrypt(ctx, commonConsts.DefaultPassword)
	record, err := dao.SysUser.Ctx(ctx).Insert(do.SysUser{
		Username: req.Username,
		Nickname: req.Nickname,
		Password: enc,
		CreateAt: utils.Now(),
	})
	if err == nil {
		userId, err := record.LastInsertId()
		if err == nil && userId > 0 {
			dao.SysUserRole.Ctx(ctx).Insert(do.SysUserRole{
				UserId: gconv.Int(userId),
				RoleId: req.RoleId,
			})
		}
	}
	return
}

func (s *sSysUser) Update(ctx context.Context, req *v1.PutUserReq) (res *v1.PutUserRes, err error) {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if !hasUserPermit(ctx, uid) {
		err = gerror.New("auth.NoPermission")
		return
	}
	if !checkUsername(ctx, req.Username, *req.Id) {
		err = gerror.New("user.valid.UserNameExist")
		return
	}
	if !checkNickname(ctx, req.Nickname, *req.Id) {
		err = gerror.New("user.valid.NickNameExist")
		return
	}
	dao.SysUser.Ctx(ctx).WherePri(req.Id).Update(do.SysUser{
		Username: req.Username,
		Nickname: req.Nickname,
		CreateAt: utils.Now(),
	})
	if req.RoleId > 0 {
		dao.SysUserRole.Ctx(ctx).Where(dao.SysUserRole.Columns().UserId, req.Id).Update(do.SysUserRole{
			RoleId: req.RoleId,
		})
	}
	return
}

func (s *sSysUser) Get(ctx context.Context, req *v1.GetUserByIdReq) (res *v1.GetUserByIdRes, err error) {
	var info *model.UserInfo
	dao.SysRole.Ctx(ctx).WherePri(req.Id).Scan(&info)
	gconv.Struct(info, &res)
	return
}

func (s *sSysUser) Delete(ctx context.Context, req *v1.DeleteUserReq) (res *v1.DeleteUserRes, err error) {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if !hasUserPermit(ctx, uid) {
		err = gerror.New("auth.NoPermission")
		return
	}
	_, err = dao.SysUser.Ctx(ctx).WherePri(req.Id).Delete()
	_, err = dao.SysUserRole.Ctx(ctx).Where(dao.SysUserRole.Columns().UserId, req.Id).Delete()
	return
}

func (s *sSysUser) GetProfile(ctx context.Context, req *v1.GetProfileReq) (res *v1.GetProfileRes, err error) {
	return
}

func (s *sSysUser) UpdateProfile(ctx context.Context, req *v1.PutProfileReq) (res *v1.PutProfileRes, err error) {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("user.valid.UserIdEmpty")
		return
	}
	if !checkNickname(ctx, req.Nickname, uid) {
		err = gerror.New("user.valid.NickNameExist")
		return
	}
	user := getUserById(ctx, uid)
	if user == nil {
		return
	}
	_, err = dao.SysUser.Ctx(ctx).WherePri(uid).Update(do.SysUser{
		Nickname: req.Nickname,
		Email:    req.Email,
		Mobile:   req.Mobile,
		Sex:      req.Sex,
		UpdateAt: utils.Now(),
	})
	return
}

func (s *sSysUser) UpdatePwd(ctx context.Context, req *v1.PutPasswordReq) (res *v1.PutPasswordRes, err error) {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("user.valid.UserIdEmpty")
		return
	}
	op, err := utils.Encrypt(ctx, req.OldPwd)
	if err != nil {
		err = gerror.New("encrypt.EncryptError")
		return
	}
	user := getUserById(ctx, uid)
	if user == nil || user.Password != op {
		err = gerror.New("user.valid.PasswordError")
		return
	}
	np, err := utils.Encrypt(ctx, req.NewPwd)
	if err != nil {
		err = gerror.New("encrypt.EncryptError")
		return
	}
	_, err = dao.SysUser.Ctx(ctx).WherePri(uid).Update(do.SysUser{
		Password: np,
		UpdateAt: utils.Now(),
	})
	return
}

func (s *sSysUser) ResetPwd(ctx context.Context, req *v1.ResetPwdReq) (res *v1.ResetPwdRes, err error) {
	if req.UserId == 0 {
		return
	}
	user := getUserById(ctx, req.UserId)
	if user == nil {
		return
	}
	np, err := utils.Encrypt(ctx, commonConsts.DefaultPassword)
	_, err = dao.SysUser.Ctx(ctx).WherePri(req.UserId).Update(do.SysUser{
		Password: np,
		UpdateAt: utils.Now(),
	})
	return
}

func (s *sSysUser) UpdateAvatar(ctx context.Context, req *v1.PutAvatarReq) (res *v1.PutAvatarRes, err error) {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("user.valid.UserIdEmpty")
		return
	}
	user := getUserById(ctx, uid)
	if user == nil {
		err = gerror.New("data.RecordNotFound")
		return
	}
	file := req.Avatar
	file.Filename = "aaa.png"
	name, err := file.Save(utils.AVATAR_PATH, true)
	if err != nil {
		err = gerror.New("file.uploadError")
		return
	}
	_, err = dao.SysUser.Ctx(ctx).WherePri(uid).Update(do.SysUser{
		Avatar:   "/avatar/" + name,
		UpdateAt: utils.Now(),
	})
	if err == nil && user.Avatar != "" {
		utils.RemoveFile(user.Avatar)
	}
	res = &v1.PutAvatarRes{
		ImgUrl: user.Avatar,
	}
	return
}

func getUserById(ctx context.Context, uid int) (user *entity.SysUser) {
	user = &entity.SysUser{}
	err := dao.SysUser.Ctx(ctx).WherePri(uid).Scan(&user)
	if err != nil {
		return nil
	}
	return
}

func hasUserPermit(ctx context.Context, uid int) bool {
	if uid == 0 {
		return false
	}
	role, err := service.SysRole().GetUserRole(ctx, uid)
	if role == nil || err != nil || role.Id != commonConsts.SuperRoleId {
		return false
	}
	return true
}

func fillRoleFields(ctx context.Context, list []*model.UserInfo) {
	userIds := make([]int, 0, len(list))
	for _, u := range list {
		userIds = append(userIds, u.Id)
	}
	var allRoles []*entity.SysRole
	err := dao.SysRole.Ctx(ctx).Scan(&allRoles)
	if err != nil {
		return
	}
	roleMap := make(map[int]string, len(allRoles))
	for _, r := range allRoles {
		roleMap[r.Id] = r.RoleName
	}
	var allUserRoles []*entity.SysUserRole
	err = dao.SysUserRole.Ctx(ctx).WhereIn(dao.SysUserRole.Columns().UserId, userIds).Scan(&allUserRoles)
	if err != nil {
		return
	}
	userRoleMap := make(map[int]int, len(allUserRoles))
	for _, r := range allUserRoles {
		userRoleMap[r.UserId] = r.RoleId
	}
	for _, u := range list {
		u.RoleId = userRoleMap[u.Id]
		u.RoleName = roleMap[u.RoleId]
		if u.RoleId == commonConsts.SuperRoleId {
			u.IsAdmin = true
		}
	}
}

func checkUsername(ctx context.Context, username string, uid int) bool {
	count, err := dao.SysUser.Ctx(ctx).
		Where(dao.SysUser.Columns().Username, username).
		WhereNot(dao.SysUser.Columns().Id, uid).
		Count()
	if err != nil || count > 0 {
		return false
	}
	return true
}

func checkNickname(ctx context.Context, nickname string, uid int) bool {
	count, err := dao.SysUser.Ctx(ctx).
		Where(dao.SysUser.Columns().Nickname, nickname).
		WhereNot(dao.SysUser.Columns().Id, uid).
		Count()
	if err != nil || count > 0 {
		return false
	}
	return true
}
