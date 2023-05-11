// @flow
import * as React from 'react';
import {Button, Input, SidePanel} from "ui";
import {FC, useState} from "react";
import {useStore} from "../../../hooks";
import {observer} from "mobx-react-lite";

const ConfigCustomDomain: FC<{
    onEdit: (value: string)=>void,
    step: 1 | 2,
    txtHost: string,
    cnameHost: string,
    txtValue: string,
    cnameValue: string,
    domain?: string
}> = ({onEdit, step, txtHost, cnameHost, txtValue, cnameValue, domain}) => {
    return (
        step === 1 ? (
            <Input className="mt-2" label="域名" value={domain} onChange={(e) => onEdit(e.currentTarget.value)} descriptionText={'您填写的域名需要已完成备案，例如：baidu.com'}/>
        ) : (
            <div>
                <p className="my-2 text-sm">请在您的域名解析服务提供商处，添加以下两条域名解析记录：</p>
                <div className="px-2 my-2">
                    <label className="border border-gray-800 rounded-md py-1 px-2 text-sm">TXT类型记录</label>
                    <Input className="my-2" label="主机记录" value={txtHost} disabled={true} copy/>
                    <Input className="my-2" label="记录值" value={txtValue} disabled={true} copy/>
                    <SidePanel.Separator/>
                    <label className="border border-gray-800 rounded-md py-1 px-2 text-sm">CNAME类型记录</label>
                    <Input className="my-2" label="主机记录" value={cnameHost} disabled={true} copy/>
                    <Input className="my-2" label="记录值" value={cnameValue} disabled={true} copy/>
                </div>
                <p className="text-sm text-gray-900 mt-5">上述记录需要您手动添加到您的域名解析记录中，添加完成后，点击'验证'即可完成自定义域名配置</p>
            </div>
        )
    )
}

type Props = {
    onCancel: () => void,
    onEdit: () => void,
    onFinish: () => void
}

const ConfigDomainSidePanel = (props: Props) => {
    const {
        onCancel,
        onEdit,
        onFinish
    } = props

    const { hosting } = useStore()

    // const [visible, setVisible] = useState(true)
    const [step, setStep] = useState<1 | 2>(1)
    const [domain, setDomain] = useState('')
    const [cnameHost, setCnameHost] = useState('')
    const [cnameValue, setCnameValue] = useState('')
    const [txtValue, setTxtValue] = useState('')
    const [txtHost, setTxtHost] = useState('')
    const [isGeneratingToken, setIsGeneratingToken] = useState(false)
    const [isBindingDomain, setIsBindingDomain] = useState(false)

    async function handleGenerateToken() {
        setIsGeneratingToken(true)
        const response = await hosting.getToken(domain)
        if (!response.error) {
            setStep(2)
            setTxtHost(response.txtHost)
            setTxtValue(response.txtValue)
            setCnameHost(response.cnameHost)
            setCnameValue(response.cnameValue)
        }
        setIsGeneratingToken(false)
    }

    async function handleBindDomain() {
        setIsBindingDomain(true)
        const response = await hosting.bindDomain(domain)
        setIsBindingDomain(false)
        if (!response.error) {
            onFinish()
        }
    }

    function handleEdit(value: string) {
        setDomain(value)
        onEdit()
    }

    return (
        <SidePanel
            visible={true}
            header="设置域名"
            onCancel={onCancel}
            customFooter={
                <div className="space-x-2 flex justify-between p-4">
                {
                    step === 1 ?
                        <>
                            <Button type="default" onClick={onCancel}>
                                取消
                            </Button>
                            <Button
                                type="primary"
                                disabled={!domain}
                                loading={isGeneratingToken}
                                onClick={() => handleGenerateToken()}
                            >
                                下一步
                            </Button>
                        </>
                     :
                        <>
                            <Button type="primary" onClick={() => setStep(1)}>
                                上一步
                            </Button>
                            <Button
                                type="primary"
                                loading={isBindingDomain}
                                onClick={() => handleBindDomain()}
                            >
                                验证
                            </Button>
                        </>
                }
                </div>
            }
        >
            <SidePanel.Content>
                <ConfigCustomDomain
                    onEdit={(value) => handleEdit(value)}
                    step={step}
                    cnameHost={cnameHost}
                    cnameValue={cnameValue}
                    txtValue={txtValue}
                    txtHost={txtHost}
                    domain={domain}
                />
            </SidePanel.Content>
        </SidePanel>
    );
};

export default observer(ConfigDomainSidePanel)
