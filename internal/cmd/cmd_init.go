package cmd

import (
	_ "github.com/shichen437/stellardex/internal/app/bookmark/logic"
	_ "github.com/shichen437/stellardex/internal/app/common/logic"
	_ "github.com/shichen437/stellardex/internal/app/ext/logic"
	_ "github.com/shichen437/stellardex/internal/app/group/logic"
	_ "github.com/shichen437/stellardex/internal/app/settings/logic"
	_ "github.com/shichen437/stellardex/internal/app/user/logic"

	_ "github.com/shichen437/stellardex/internal/pkg/monitor"
)
