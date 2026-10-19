export function diagramFor(lessonId,title){
  if(lessonId==='07-03'&&title.startsWith('Chandy'))return `<figure class="mechanism-figure"><picture><source media="(max-width:650px)" srcset="./assets/snapshot-mobile.svg"><img src="./assets/snapshot.svg" width="720" height="350" alt="P1存档3枚，P2发出令牌后存档2枚；令牌m单独记录在通道中1枚，快照合计6枚。" loading="lazy"></picture><figcaption>P2 发送 m 后才存档；P1 收到 m 前已存档。因此 m 进入通道状态，不能再加回 P1 的本地存档。图中实线为业务消息，虚线为标记；每条有向通道可靠且 FIFO。</figcaption></figure>`;
  if(lessonId==='08-02'&&title.startsWith('AllReduce'))return `<figure class="mechanism-figure"><div class="diagram-pair"><img src="./assets/parameter-server.svg" width="340" height="270" alt="参数服务器接收梯度2和4，集中更新参数10到9.7。" loading="lazy"><img src="./assets/allreduce.svg" width="340" height="270" alt="AllReduce让两个Worker各自获得平均梯度3，再分别把参数10更新为9.7。" loading="lazy"></div><figcaption>同一轮同步训练，假设两节点样本量相同、初始参数 W=10、学习率 0.1。平均梯度为 3，更新为 10−0.1×3=9.7。PS 逻辑角色可分布在多台服务器；AllReduce 仍有集合通信与同步成本。</figcaption></figure>`;
  return '';
}
