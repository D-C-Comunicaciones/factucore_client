"use client"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Badge } from "@/components/ui/badge"
import { IconLoader } from "@tabler/icons-react"
import { KeyRound, ShieldCheck } from "lucide-react"
import { useTwoFactorStatus } from "@/hooks/profile/useTwoFactorStatus"
import {
    useEnableTwoFactor,
    useConfirmTwoFactor,
    useDisableTwoFactor,
    useRegenerateRecoveryCodes,
} from "@/hooks/profile/useTwoFactorMutations"
import { RecoveryCodesDisplay } from "./RecoveryCodesDisplay"
import { extractErrorMessage } from "@/lib/errors"
import { showToast } from "@/components/sonner/CustomToaster"

type Step = "manage" | "disable-otp" | "codes-otp" | "codes-result" | "intro" | "qr" | "confirm" | "success"
type CodeMode = "code" | "recovery"

interface TwoFactorPanelProps {
    open: boolean
    mode: "enable" | "manage"
    verifiedPassword: string
    onClose: () => void
}

const ENABLE_STEP_PROGRESS: Partial<Record<Step, number>> = {
    intro: 25,
    qr: 50,
    confirm: 75,
    success: 100,
}

const OTP_SLOTS = [0, 1, 2, 3, 4, 5]

function CodeModeToggle({ mode, onToggle }: { mode: CodeMode; onToggle: () => void }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="text-sm text-primary underline underline-offset-2 w-fit mx-auto cursor-pointer"
        >
            {mode === "code" ? "Usar un código de recuperación" : "Usar el código de la app"}
        </button>
    )
}

export function TwoFactorPanel({ open, mode, verifiedPassword, onClose }: TwoFactorPanelProps) {
    const { data: statusRes } = useTwoFactorStatus()
    const enableTwoFactor = useEnableTwoFactor()
    const confirmTwoFactor = useConfirmTwoFactor()
    const disableTwoFactor = useDisableTwoFactor()
    const regenerate = useRegenerateRecoveryCodes()

    const [step, setStep] = useState<Step>(mode === "enable" ? "intro" : "manage")
    const [showDisableConfirm, setShowDisableConfirm] = useState(false)

    const [disableMode, setDisableMode] = useState<CodeMode>("code")
    const [disableCode, setDisableCode] = useState("")

    const [codesMode, setCodesMode] = useState<CodeMode>("code")
    const [codesCode, setCodesCode] = useState("")

    const [confirmCode, setConfirmCode] = useState("")
    const [rememberDevice, setRememberDevice] = useState(false)
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])

    useEffect(() => {
        if (open) {
            setStep(mode === "enable" ? "intro" : "manage")
            setShowDisableConfirm(false)
            setDisableMode("code")
            setDisableCode("")
            setCodesMode("code")
            setCodesCode("")
            setConfirmCode("")
            setRememberDevice(false)
            setRecoveryCodes([])
            if (mode === "enable") {
                enableTwoFactor.mutate()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mode])

    const status = statusRes?.data
    const enableData = enableTwoFactor.data?.data
    const enableProgress = ENABLE_STEP_PROGRESS[step] ?? 0

    const handleConfirmDisable = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await disableTwoFactor.mutateAsync({
                password: verifiedPassword,
                ...(disableMode === "code" ? { code: disableCode } : { recovery_code: disableCode }),
            })
            onClose()
        } catch (err) {
            showToast(extractErrorMessage(err), "error")
            setDisableCode("")
        }
    }

    const handleSubmitCodesOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await regenerate.mutateAsync({
                password: verifiedPassword,
                ...(codesMode === "code" ? { code: codesCode } : { recovery_code: codesCode }),
            })
            setRecoveryCodes(res.data?.recovery_codes || [])
            setStep("codes-result")
        } catch (err) {
            showToast(extractErrorMessage(err), "error")
            setCodesCode("")
        }
    }

    const handleConfirmEnable = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await confirmTwoFactor.mutateAsync({ code: confirmCode, remember_device: rememberDevice })
            setRecoveryCodes(res.data?.recovery_codes || [])
            setStep("success")
        } catch (err) {
            showToast(extractErrorMessage(err), "error")
            setConfirmCode("")
        }
    }

    return (
        <>
        <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
            <SheetContent
                className="w-full sm:max-w-xl bg-white flex flex-col p-0 gap-0"
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                {step === "manage" && (
                    <>
                        <SheetHeader>
                            <SheetTitle>Métodos de autenticación activados</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
                            <p className="text-sm text-muted-foreground">
                                Conoce las opciones que tienes activas para verificar que eres tú al iniciar sesión en Alegra.
                            </p>

                            <div className="flex items-center justify-between rounded-md border p-4">
                                <div>
                                    <p className="font-medium">Autenticación en dos pasos</p>
                                    <p className="text-sm text-muted-foreground">
                                        {status?.confirmed_at
                                            ? `Activada desde el ${new Date(status.confirmed_at).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}`
                                            : "Activada"}
                                    </p>
                                </div>
                                <span className="inline-flex cursor-pointer" onClick={() => setShowDisableConfirm(true)}>
                                    <Switch checked onCheckedChange={() => {}} className="pointer-events-none" />
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep("codes-otp")}
                                className="text-left rounded-md border p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <p className="font-medium flex items-center gap-1.5">
                                    <KeyRound className="size-4" /> Códigos de respaldo
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Son códigos de uso único y es importante que los guardes en un lugar seguro para autenticarte cuando no tengas tu teléfono cerca.
                                </p>
                            </button>

                            <div className="rounded-md border p-4">
                                <p className="font-medium flex items-center gap-1.5">
                                    <ShieldCheck className="size-4" /> App de autenticación
                                    <Badge variant="outline">Principal</Badge>
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Puedes usar una aplicación como <strong>Google Authenticator</strong> en tu teléfono para obtener un código único cada que vayas a ingresar a tu cuenta.
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {step === "disable-otp" && (
                    <>
                        <SheetHeader>
                            <SheetTitle>Confirma la desactivación</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                Para confirmar, es necesario que incluyas el código de tu app de autenticación. Ten en cuenta que puedes volver a activar este método de seguridad en cualquier momento.
                            </p>
                            <form onSubmit={handleConfirmDisable} className="flex flex-col gap-4">
                                {disableMode === "code" ? (
                                    <div className="flex justify-center">
                                        <InputOTP maxLength={6} value={disableCode} onChange={setDisableCode} autoFocus>
                                            <InputOTPGroup>
                                                {OTP_SLOTS.map((i) => <InputOTPSlot key={i} index={i} />)}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                ) : (
                                    <Input
                                        value={disableCode}
                                        onChange={(e) => setDisableCode(e.target.value)}
                                        placeholder="Código de recuperación"
                                        autoFocus
                                        className="text-center"
                                    />
                                )}
                                <CodeModeToggle
                                    mode={disableMode}
                                    onToggle={() => { setDisableMode((p) => (p === "code" ? "recovery" : "code")); setDisableCode("") }}
                                />
                            </form>
                        </div>
                        <SheetFooter className="flex-row justify-between border-t">
                            <Button type="button" variant="outline" className="cursor-pointer bg-white hover:bg-gray-100" onClick={() => setStep("manage")}>
                                Volver a mis notificaciones
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                className="cursor-pointer"
                                onClick={handleConfirmDisable}
                                disabled={disableTwoFactor.isPending || !disableCode}
                            >
                                {disableTwoFactor.isPending && <IconLoader className="animate-spin" />}
                                Continuar
                            </Button>
                        </SheetFooter>
                    </>
                )}

                {step === "codes-otp" && (
                    <>
                        <SheetHeader>
                            <SheetTitle>Ingresa un código de autenticación</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                Para acceder a tus códigos de respaldo debes ingresar un código de seguridad generado en tu app de autenticación.
                            </p>
                            <form onSubmit={handleSubmitCodesOtp} className="flex flex-col gap-4">
                                {codesMode === "code" ? (
                                    <div className="flex justify-center">
                                        <InputOTP maxLength={6} value={codesCode} onChange={setCodesCode} autoFocus>
                                            <InputOTPGroup>
                                                {OTP_SLOTS.map((i) => <InputOTPSlot key={i} index={i} />)}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                ) : (
                                    <Input
                                        value={codesCode}
                                        onChange={(e) => setCodesCode(e.target.value)}
                                        placeholder="Código de recuperación"
                                        autoFocus
                                        className="text-center"
                                    />
                                )}
                                <CodeModeToggle
                                    mode={codesMode}
                                    onToggle={() => { setCodesMode((p) => (p === "code" ? "recovery" : "code")); setCodesCode("") }}
                                />
                            </form>
                        </div>
                        <SheetFooter className="flex-row justify-between border-t">
                            <Button type="button" variant="outline" className="cursor-pointer bg-white hover:bg-gray-100" onClick={() => setStep("manage")}>
                                Volver a mis notificaciones
                            </Button>
                            <Button
                                type="button"
                                className="cursor-pointer"
                                onClick={handleSubmitCodesOtp}
                                disabled={regenerate.isPending || !codesCode}
                            >
                                {regenerate.isPending && <IconLoader className="animate-spin" />}
                                Continuar
                            </Button>
                        </SheetFooter>
                    </>
                )}

                {step === "codes-result" && (
                    <>
                        <SheetHeader>
                            <SheetTitle>Códigos de respaldo</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                            <RecoveryCodesDisplay codes={recoveryCodes} onAcknowledge={() => setStep("manage")} />
                        </div>
                    </>
                )}

                {step === "intro" && (
                    <>
                        <SheetHeader>
                            <SheetTitle>Autenticación en dos pasos 🔑</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
                            <p className="text-sm text-muted-foreground">
                                Aumenta la seguridad de tu cuenta y protégete del robo de contraseñas en caso de que uses la misma en diferentes sitios.
                            </p>
                            <div className="flex justify-center py-6">
                                <ShieldCheck className="size-24 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold mb-1">¿Cómo funciona?</p>
                                <p className="text-sm text-muted-foreground">
                                    Al iniciar sesión te pediremos un código aleatorio para autorizar el ingreso a tu cuenta. De igual forma, puedes registrar tu dispositivo de uso frecuente para ingresar sin necesidad de un código.
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold mb-1">¿Qué necesitas para activarla?</p>
                                <p className="text-sm text-muted-foreground">
                                    Solo requieres un teléfono para usar una aplicación de autenticación como Google Authenticator.
                                </p>
                            </div>
                        </div>
                        <SheetFooter className="gap-2 border-t">
                            <Progress value={enableProgress} className="h-1.5" />
                            <div className="flex justify-between">
                                <Button type="button" variant="outline" className="cursor-pointer bg-white hover:bg-gray-100" onClick={onClose}>
                                    Volver a mis notificaciones
                                </Button>
                                <Button type="button" className="cursor-pointer" onClick={() => setStep("qr")} disabled={enableTwoFactor.isPending}>
                                    {enableTwoFactor.isPending && <IconLoader className="animate-spin" />}
                                    Continuar
                                </Button>
                            </div>
                        </SheetFooter>
                    </>
                )}

                {step === "qr" && (
                    <>
                        <SheetHeader>
                            <SheetTitle>Aplicación de autenticación</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
                            {enableData ? (
                                <>
                                    <p className="text-sm text-muted-foreground">
                                        Puedes usar una aplicación como <strong>Google Authenticator</strong> en tu teléfono para obtener un código único cada que vayas a ingresar a tu cuenta
                                    </p>
                                    <p className="text-sm"><strong>1. Abre</strong> tu aplicación de autenticación.</p>
                                    <p className="text-sm"><strong>2. Escanea</strong> este código QR con la app o ingresa la clave de configuración.</p>
                                    <div className="flex justify-center">
                                        <img
                                            src={`data:image/svg+xml;base64,${enableData.qr_svg}`}
                                            alt="Código QR para 2FA"
                                            className="h-48 w-48"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Clave de configuración</p>
                                        <code className="block rounded bg-muted px-3 py-2 text-sm break-all select-all">{enableData.secret}</code>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        3. Una vez escanees el QR o ingreses la clave, puedes continuar e incluir el código generado por la app para confirmar la activación.
                                    </p>
                                </>
                            ) : (
                                <div className="flex justify-center py-10">
                                    <IconLoader className="animate-spin" />
                                </div>
                            )}
                        </div>
                        <SheetFooter className="gap-2 border-t">
                            <Progress value={enableProgress} className="h-1.5" />
                            <div className="flex justify-between">
                                <Button type="button" variant="outline" className="cursor-pointer bg-white hover:bg-gray-100" onClick={onClose}>
                                    Volver a mis notificaciones
                                </Button>
                                <Button type="button" className="cursor-pointer" onClick={() => setStep("confirm")} disabled={!enableData}>
                                    Continuar
                                </Button>
                            </div>
                        </SheetFooter>
                    </>
                )}

                {step === "confirm" && (
                    <>
                        <SheetHeader>
                            <SheetTitle>Confirma la activación</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                Incluye el código de 6 dígitos generado en tu app de autenticación.
                            </p>
                            <form onSubmit={handleConfirmEnable} className="flex flex-col gap-4">
                                <div className="flex justify-center">
                                    <InputOTP maxLength={6} value={confirmCode} onChange={setConfirmCode} autoFocus>
                                        <InputOTPGroup>
                                            {OTP_SLOTS.map((i) => <InputOTPSlot key={i} index={i} />)}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <label className="flex items-center justify-center gap-2 text-sm cursor-pointer">
                                    <Checkbox
                                        checked={rememberDevice}
                                        onCheckedChange={(checked) => setRememberDevice(checked === true)}
                                    />
                                    No pedir código en este dispositivo
                                </label>
                            </form>
                        </div>
                        <SheetFooter className="gap-2 border-t">
                            <Progress value={enableProgress} className="h-1.5" />
                            <div className="flex justify-between">
                                <Button type="button" variant="outline" className="cursor-pointer bg-white hover:bg-gray-100" onClick={onClose}>
                                    Volver a mis notificaciones
                                </Button>
                                <Button
                                    type="button"
                                    className="cursor-pointer"
                                    onClick={handleConfirmEnable}
                                    disabled={confirmTwoFactor.isPending || confirmCode.length !== 6}
                                >
                                    {confirmTwoFactor.isPending && <IconLoader className="animate-spin" />}
                                    Continuar
                                </Button>
                            </div>
                        </SheetFooter>
                    </>
                )}

                {step === "success" && (
                    <>
                        <SheetHeader>
                            <SheetTitle>¡Ya está activada la autenticación! ✅</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                            <RecoveryCodesDisplay codes={recoveryCodes} onAcknowledge={onClose} />
                        </div>
                        <SheetFooter className="border-t">
                            <Progress value={100} className="h-1.5" />
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>

        <Dialog open={showDisableConfirm} onOpenChange={setShowDisableConfirm}>
            <DialogContent
                className="bg-white"
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="sr-only">Desactivar autenticación en dos pasos</DialogTitle>
                </DialogHeader>
                <p className="text-sm">
                    Al desactivar este método de seguridad de tu cuenta ya no te pediremos un código al iniciar sesión en Alegra.
                </p>
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer bg-white hover:bg-gray-100"
                        onClick={() => setShowDisableConfirm(false)}
                    >
                        Volver a mis notificaciones
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => { setShowDisableConfirm(false); setStep("disable-otp") }}
                    >
                        Desactivar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}
