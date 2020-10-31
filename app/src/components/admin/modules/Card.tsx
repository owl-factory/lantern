import { Card, Button } from "react-bootstrap";
import Link from "next/link";
import ModuleTable from "./Table";
import { GameSystem } from "@reroll/model/dist/documents/GameSystem";
import { Module } from "@reroll/model/dist/documents/Module";

interface ModuleCardProps {
  gameSystem: GameSystem;
  modules: Module[];
}

/**
 * Renders a card with a module table
 * @param props.gameSystem The game system of the modules
 * @param props.modules The array of modules to render into a table
 */
export function ModuleCard(props: ModuleCardProps) {
  const gameSystemAlias = props.gameSystem.alias || props.gameSystem._id;

  return (
    <Card>
      <Card.Header>
        <>Modules</>
        <Link href={"/admin/game-systems/" + gameSystemAlias + "/modules/new"}  passHref>
          <Button size="sm" style={{float:"right"}}>Add Module</Button>
        </Link>
        <Link href={"/admin/game-systems/" + gameSystemAlias + "/modules"}  passHref>
          <Button size="sm" style={{float:"right"}}>Search Modules</Button>
        </Link>
      </Card.Header>

      <Card.Body>
        <ModuleTable
          gameSystem={props.gameSystem}
          modules={props.modules}
          pageState={{page: 1, perPage: 10}}
        />
      </Card.Body>
    </Card>
  )
}