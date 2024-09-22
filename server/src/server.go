package main

import (
	"database/sql"
	"fmt"
	"qq-server/routes"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

var db *sql.DB

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
	app.Post("/register", func(c *fiber.Ctx) error {
		return routes.RegisterRoute(c, db)
	})
	app.Post("/login", func(c *fiber.Ctx) error {
		return routes.LoginRoute(c, db)
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
