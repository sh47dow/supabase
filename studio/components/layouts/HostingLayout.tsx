// @flow
import * as React from 'react';
import ProjectLayout from "./ProjectLayout/ProjectLayout";
import {FC, ReactNode, useEffect} from "react";
import {observer} from "mobx-react-lite";
import {useStore, withAuth} from "../../hooks";

type Props = {
    title?: string
    children?: ReactNode
};
const HostingLayout: FC<Props> = ({ title, children }) => {
    const {hosting, ui} = useStore()
    useEffect(() => {
        if (ui.selectedProjectRef) {
            hosting.fetchByPath()
            hosting.queryDomain()
        }
    }, [ui.selectedProjectRef])

    return (
        <ProjectLayout title={title || 'Hosting'} product="Static Hosting">
            {children}
        </ProjectLayout>
    );
};

export default withAuth(observer(HostingLayout))
