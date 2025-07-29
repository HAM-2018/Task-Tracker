import type { FC, ReactElement } from "react"
import { Card } from "../ui/card";
import { CreateTaskForm } from "../createTaskForm/createTaskForm";
import { Logout } from "../logout/logout";
import { UserProfile } from "../userProfile/userProfile";
import styles from "./style.module.css";

export const TaskSidebar: FC = (): ReactElement => {
    return (
        <section className={`fixed top-4 right-4 ${styles.sidebarHeight}`}>
            <Card className="flex flex-col w-full h-full p-6 justify-between">
                <UserProfile />
                <CreateTaskForm/>
                <Logout/>
            </Card>
        </section>
    )
};