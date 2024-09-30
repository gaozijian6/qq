package routes

import (
	"database/sql"
	"fmt"
	"reflect"

	"github.com/gofiber/fiber/v2"
)

type friendUserList struct {
	ID       string `json:"id"`
	Avatar   string `json:"avatar"`
	Username string `json:"username"`
}

type params struct {
	Value string `json:"value"`
}

func FindFriendRoute(c *fiber.Ctx, db *sql.DB) error {
	params := new(params)

	if err := c.BodyParser(params); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "无效的请求数据",
		})
	}

	rows, err := db.Query("SELECT id, avatar, username FROM users WHERE id LIKE ? OR username LIKE ?", "%"+params.Value+"%", "%"+params.Value+"%")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "查询用户信息失败",
		})
	}
	defer rows.Close()

	var users []friendUserList
	for rows.Next() {
		var user friendUserList
		err := rows.Scan(&user.ID, &user.Avatar, &user.Username)
		fmt.Println(reflect.TypeOf(user.ID))
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": "处理用户数据失败",
			})
		}
		users = append(users, user)
	}

	if len(users) == 0 {
		return c.JSON(fiber.Map{
			"success": false,
			"message": "未找到匹配的用户",
			"users":   []friendUserList{},
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "成功找到用户",
		"users":   users,
	})
}
