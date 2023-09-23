import { Card,CardContent,CardHeader,CardTitle,} from "@/registry/tui/ui/card"
import { ButtonGroup } from "../../ui/button-group"

export function CardsButtonGroup() {
    const options = {
        items: [
            { name: 'Save and schedule', href: '#' },
            { name: 'Save and publish', href: '#' },
            { name: 'Export PDF', href: '#' },
        ],
    };
    const buttons = [
        { checkbox: true },
        { dropdownOptions: ['Unread messages', 'Sent messages', 'All messages'] },
      ];
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-normal text-primary">Button Group</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-m font-bold text-primary">Basic</div>
                    <ButtonGroup buttons={ [{name:'Years'},{name:'Month'},{name:'Days'}]} color="gray" />

                    <div className="text-m mt-[13px] font-bold text-primary">Icon only</div>
                    <ButtonGroup buttons={[{icon:"chevron-left-solid"},{icon:"chevron-right-solid"}]} iconStyle="h-4 w-4" color="gray" />


                    <div className="text-m mt-[13px] font-bold text-primary">With stat</div>
                    <ButtonGroup buttons={ [{name:'Bookmark',icon:"bookmark-solid"},{name:'12k'}]} iconStyle="h-4 w-4" color="gray" />


                    <div className="text-m mt-[13px] font-bold text-primary">With checkbox and dropdown</div>
                    <ButtonGroup buttons={ buttons}  color="gray"/>
                    
                    <div className="text-m mt-[13px] font-bold text-primary">With dropdown</div>
                    <ButtonGroup buttons={ [{name:'Save Changes'},{icon:"chevron-down-solid"}]} iconStyle="h-4 w-4" options={options} color="gray"/>

                </CardContent>
            </Card>
        </div>
    )
}