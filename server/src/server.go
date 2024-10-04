package main

import (
	"database/sql"
	"fmt"
	"qq-server/routes"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/websocket/v2"
)

var db *sql.DB
var jwtSecret = []byte("your-secret-key")

func initDB() {
	var err error
	db, err = sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/qq")
	if err != nil {
		panic(err)
	}

	if err = db.Ping(); err != nil {
		panic(err)
	}

	fmt.Println("成功连接到MySQL数据库")
}

func SetupRoutes(app *fiber.App) {
	app.Use(cors.New())
	app.Use(func(c *fiber.Ctx) error {
		c.Set("Content-Security-Policy", "default-src 'self'; img-src 'self' http://127.0.0.1:9000")
		return c.Next()
	})
	app.Post("/register", func(c *fiber.Ctx) error {
		return routes.RegisterRoute(c, db)
	})
	app.Post("/login", func(c *fiber.Ctx) error {
		return routes.LoginRoute(c, db, jwtSecret)
	})
	app.Use("/ws", websocket.New(func(c *websocket.Conn) {
		routes.WebsocketConnect(c, db)
	}))
	app.Use(func(c *fiber.Ctx) error {
		return routes.ProtectedRoute(c, jwtSecret)
	})
	app.Get("/user/info", func(c *fiber.Ctx) error {
		return routes.UserInfoRoute(c, db, jwtSecret)
	})
	app.Post("/findFriend", func(c *fiber.Ctx) error {
		return routes.FindFriendRoute(c, db)
	})
	app.Post("/friendRequest", func(c *fiber.Ctx) error {
		return routes.FriendRequestRoute(c, db)
	})
}

func main() {
	initDB()
	defer db.Close()

	app := fiber.New()

	SetupRoutes(app)

	fmt.Println("服务器正在启动，监听端口 3000...")
	err := app.Listen(":3000")
	if err != nil {
		fmt.Printf("服务器启动失败: %v\n", err)
		panic(err)
	}
}
