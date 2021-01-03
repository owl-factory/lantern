import { Content, ContentType, GameSystem } from "../../../../types/documents";
import React from "react";
import Page from "../../../../components/design/Page";
import { AtomType } from "../../../../components/layouts/atoms";
import { Section, Subsection } from "../../../../components/layouts/Layouts";
import { MoleculeType } from "../../../../components/layouts/molecules";
import SearchLayout from "../../../../components/layouts/SearchLayout";

type TableLayout = any;

interface SearchType {
  form: Section[];
  table: TableLayout[];
  subsections: Record<string, Subsection>;
}

const searchLayout: SearchType = {
  form: [
    {
      h: 5,
      w: {xs: 12},
      subsections: [
        "class_select",
        "basic_spell",
        "advanced_filters",
        "reset_filters"
      ]
    }
  ],
  table: [
    {
      w: { xs: 2, sm: 1 },
      staticValues: {}
    }
  ],
  subsections: {
    class_select: { h: 5, w: { xs: 12 }, molecules: [] },
    basic_spell: { h: 3, w: { xs: 12 }, molecules: [{
      type: AtomType.TextInput,
      staticValues: {
        label: "Spell Name",
        placeholder: "Search Spell Names",
        inputName: "name"
      }
    },
    {
      type: AtomType.MultiselectInput,
      display: { xs: "none", md: "block" },
      staticValues: {
        label: "Spell Level",
        placeholder: "Select Spell Levels",
        inputName: "data.levels"
      }
    },
    {
      type: AtomType.MultiselectInput,
      display: { xs: "none", md: "block" },
      staticValues: {
        label: "Spell Tags",
        placeholder: "Healing, Utility, etc.",
        inputName: "data.tags"
      }
    },
    {
      type: AtomType.MultiselectInput,
      display: { xs: "none", md: "block" },
      staticValues: {
        label: "Casting Time",
        placeholder: "Select Casting Times",
        inputName: "data.casting_time"
      }
    },
    {
      type: MoleculeType.Div,
      display: { xs: "none", md: "block" },
      atoms: [
        {
          type: AtomType.Submit,
          staticValues: {
            label: "Filter Spells"
          }
        },
        {
          type: AtomType.Action,
          staticValues: {
            label: "Reset Filters"
          }
        },
      ]
    }
    
    ] },
    advanced_filters: { h: 2, w: { xs: 12 }, collapse: {}, molecules: [
      {
        type: MoleculeType.Accordion,
        atoms: [
          {
            type: AtomType.MultiselectInput,
            display: { xs: "block", md: "none" },
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Spell Level",
              placeholder: "Select Spell Levels",
              inputName: "data.levels"
            }
          },
          {
            type: AtomType.MultiselectInput,
            display: { xs: "block", md: "none" },
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Spell Tags",
              placeholder: "Healing, Utility, etc.",
              inputName: "data.tags"
            }
          },
          {
            type: AtomType.MultiselectInput,
            display: { xs: "block", md: "none" },
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Casting Time",
              placeholder: "Select Casting Times",
              inputName: "data.casting_time"
            }
          },
          {
            type: AtomType.MultiselectInput,
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Spell School",
              placeholder: "Select Schools of Magic",
              inputName: "data.magic_school"
            }
          },
          {
            type: AtomType.MultiselectInput,
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Save Required",
              placeholder: "Select Abilities",
              inputName: "data.save_required"
            }
          },
          {
            type: AtomType.MultiselectInput,
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Attack Type",
              placeholder: "Melee, Ranged...",
              inputName: "data.attack_type"
            }
          },
          {
            type: AtomType.MultiselectInput,
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Damage Type",
              placeholder: "Acid, Bludgeoning, etc.",
              inputName: "data.damage_type"
            }
          },
          {
            type: AtomType.MultiselectInput,
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Conditions",
              placeholder: "Select Conditions",
              inputName: "data.conditions"
            }
          },
          {
            type: AtomType.TernaryInput,
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Conditions",
              placeholder: "Select Conditions",
              inputName: "data.conditions"
            }
          },
          {
            type: AtomType.MultiselectInput,
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Spell School",
              placeholder: "Select Schools of Magic",
              inputName: "data.magic_school"
            }
          },
          // Multi checkbox? Ternary? 
          {
            type: AtomType.SelectInput,
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Concentration",
              placeholder: "--",
              inputName: "data.concentration"
            }
          },
          {
            type: AtomType.SelectInput,
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Ritual",
              placeholder: "--",
              inputName: "data.ritual"
            }
          },
          {
            type: AtomType.MultiselectInput,
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Source Category",
              placeholder: "--",
              inputName: "data.source_category"
            }
          },
          {
            type: AtomType.MultiselectInput,
            w: { xs: 12, md: 3 },
            staticValues: {
              label: "Source",
              placeholder: "--",
              inputName: "moduleID"
            }
          },
        ],
        staticValues: {
          label: "Advanced Filters"
        }
      }
    ] },
    reset_filters: { h: 1, w: { xs: 12 }, molecules: [
      {
        type: MoleculeType.Div,
        display: { xs: "block", md: "none" },
        atoms: [
          {
            type: AtomType.Submit,
            staticValues: {
                label: "Filter Spells"
            }
          },
          {
            type: AtomType.Action,
            staticValues: {
              label: "Reset Filters"
            }
          },
        ]
      }
      
    ] },
  },
  // content: {}
}

const searchData: Content[] = [
  { name: "Firebolt", data: { level: "0", casting_time: "1 Action", duration: "24 Hours", range: "30ft"} }
]

function onSearch(values: Record<string, string>) {
  console.log("Search");
}

export default function ContentTypeSearch(props: any) {
  return (
    <Page>
      <h1>{props.contentType.name}</h1>

      {/* Search box */}
      {/* <DynamicLayout dynamicLayout=/> */}
      <SearchLayout searchLayout={searchLayout} onSubmit={onSearch} searchData={searchData}/> 
      
      {/* Search results */}

      {/* Pagination */}
    </Page>
  );
}

ContentTypeSearch.getInitialProps = () => {
  const contentCount = 0;
  const contentType: ContentType = {
    name: "Spells",
    gameSystemID: "123123123123123123123123",
    
  };
  const initialContent: Content[] = [];
  const gameSystem: GameSystem | undefined = undefined;

  return {
    contentCount,
    initialContent,
    gameSystem,
    contentType,
  };
}