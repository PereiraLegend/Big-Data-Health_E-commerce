import { render, screen } from "@testing-library/react"
import Produtos from "@/app/components/Home/Produtos"
import Home from "@/app/page"
import { it } from "node:test"

it("Renderizou o projeto", () => {
    render(<Home />)
})