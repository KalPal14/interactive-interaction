import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { TMonoObject } from 'ts/types/shared'

declare global {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		timeout: number
	}
}
interface IHookProps {
	defaultIsOpen?: boolean
}
interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		isOpen: boolean
		additionalInfo: TMonoObject<string> | undefined
	}
	actions: {
		onOpen: () => void
		onTemporaryOpen: (deley?: number, additionalInfo?: TMonoObject<string>) => void
		onClose: () => void
		onToggle: () => void
	}
}
const Disclosure = createContext<IContext | null>(null)

export function useDisclosure({ defaultIsOpen = false }: IHookProps = {}): IContext {
	const context = useContext(Disclosure)
	if (!context) {
		throw new Error('useDisclosure must be used within an DisclosureProvider')
	}

	const { onOpen, onClose } = context.actions
	useEffect(() => {
		if (defaultIsOpen) {
			onOpen()
		} else {
			onClose()
		}
	}, [])

	return context
}

export const DisclosureProvider = ({ children }: IProviderProps): JSX.Element => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [additionalInfo, setAdditionalInfo] = useState<TMonoObject<string> | undefined>()

	const value: IContext = useMemo(() => {
		function onOpen(additionalInfo?: TMonoObject<string>): void {
			setIsOpen(true)
			setAdditionalInfo(additionalInfo)
		}

		function onTemporaryOpen(deley?: number, additionalInfo?: TMonoObject<string>): void {
			setIsOpen(true)
			setAdditionalInfo(additionalInfo)

			if (window.timeout) {
				window.clearTimeout(window.timeout)
			}
			window.timeout = window.setTimeout(() => {
				setIsOpen(false)
			}, deley || 0)
		}

		function onClose(additionalInfo?: TMonoObject<string>): void {
			setIsOpen(false)
			setAdditionalInfo(additionalInfo)
		}

		function onToggle(additionalInfo?: TMonoObject<string>): void {
			setIsOpen((prevState) => !prevState)
			setAdditionalInfo(additionalInfo)
		}

		return {
			data: { isOpen, additionalInfo },
			actions: { onOpen, onTemporaryOpen, onClose, onToggle },
		}
	}, [isOpen, additionalInfo])
	return <Disclosure.Provider value={value}>{children}</Disclosure.Provider>
}
