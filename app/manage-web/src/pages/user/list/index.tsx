import TablePagination from "@app/manage-web/components/pagination/pagination";
import { useUserListState } from "@app/manage-web/hooks/user";
import { Button, Input, Table } from "@heroui/react";
import { useEffect, useState } from "react";

export default function UserList() {
  const { userListState, fetchUserList } = useUserListState();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUserList(1, 20, search);
  }, [fetchUserList]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">用户列表</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          {/* <Label>Email: </Label> */}
          <Input value={search} onChange={(e) => setSearch(e.target.value)} variant="secondary" placeholder="搜索ID/用户名/邮箱" className="w-48" />
        </div>
        <Button variant="primary" size="sm" onClick={() => fetchUserList(1, 20, search)}>查询</Button>
        <div className="flex-1"></div>
        {/* <Button variant="primary" size="sm">添加用户</Button> */}
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Team members" className="min-w-[600px]">
            <Table.Header>
              <Table.Column isRowHeader>ID</Table.Column>
              <Table.Column>编号</Table.Column>
              <Table.Column>来源</Table.Column>
              <Table.Column>用户名</Table.Column>
              <Table.Column>邮箱</Table.Column>
              <Table.Column>订阅状态</Table.Column>
              <Table.Column>创建日期</Table.Column>
              <Table.Column>更新日期</Table.Column>
            </Table.Header>
            <Table.Body>
              {
                userListState.list?.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.bizId}</Table.Cell>
                    <Table.Cell>{item.productHost}</Table.Cell>
                    <Table.Cell>{item.username}</Table.Cell>
                    <Table.Cell>{item.email}</Table.Cell>
                    <Table.Cell>{item.memberStatus}</Table.Cell>
                    <Table.Cell>{item.createTime}</Table.Cell>
                    <Table.Cell>{item.updateTime}</Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <TablePagination
        page={userListState.page || 1}
        size={userListState.size || 10}
        total={userListState.total || 0}
        onPageChange={(page) => fetchUserList(page, userListState.size, search)}
      />
    </div>
  );
}
