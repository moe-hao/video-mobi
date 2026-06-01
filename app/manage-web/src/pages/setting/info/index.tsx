import { useAuthCheck, useChangePassword } from "@app/manage-web/hooks/user";
import { Button, FieldError, Form, Input, Label, Modal, TextField } from "@heroui/react";
import { useEffect, useState } from "react";

export default function SettingInfo() {
  const { user } = useAuthCheck();
  const { fetchChangePassword } = useChangePassword();

  useEffect(() => {
    document.title = "个人设置";
  }, []);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);

  const isConfirmPasswordInvalid = confirmPassword !== newPassword;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-bold">个人设置</div>
      </div>
      <Form className="flex w-96 flex-col gap-4">
        <TextField name="username" type="text">
          <Label>用户名</Label>
          <Input variant="secondary" disabled value={user?.username} />
        </TextField>
        <div className="flex gap-2">
          <Modal isOpen={isOpenChangePassword} onOpenChange={(open) => setIsOpenChangePassword(open)}>
            <Button onClick={() => setIsOpenChangePassword(true)}>修改密码</Button>
            <Modal.Backdrop isDismissable={false}>
              <Modal.Container size="lg">
                <Modal.Dialog aria-label="修改密码" className="gray-100 min-w-[600px]">
                  <Modal.CloseTrigger />
                  <Modal.Header>
                    <Modal.Heading>修改密码</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body className="flex flex-col gap-4 p-2">

                    <div className="flex flex-row items-center gap-4 text-right h-12">
                      <Label className="w-24 shrink-0">输入密码: </Label>
                      <Input variant="secondary" className="w-full" type="password" onChange={(e) => setOldPassword(e.target.value)} />
                    </div>
                    <div className="flex flex-row items-center gap-4 text-right h-12">
                      <Label className="w-24 shrink-0">输入新密码: </Label>
                      <Input variant="secondary" className="w-full" type="password" onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <TextField isInvalid={isConfirmPasswordInvalid} className="h-12">
                      <div className="flex flex-row items-center gap-4 text-right">
                        <Label className="w-24 shrink-0">确认新密码: </Label>
                        <Input variant="secondary" className="w-full" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                      </div>
                      <FieldError className="text-right">两次输入密码不一致</FieldError>
                    </TextField>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      isDisabled={isConfirmPasswordInvalid}
                      onClick={() => {
                        fetchChangePassword(oldPassword, newPassword);
                        setIsOpenChangePassword(false)
                      }}
                    >
                      确认修改
                    </Button>
                  </Modal.Footer>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        </div>
      </Form>
    </div>

  );
}
